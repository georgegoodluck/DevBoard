import { FastifyInstance } from "fastify";
import { db } from "../db/index.js";
import { projects, activity } from "../db/schema.js";
import { eq, and } from "drizzle-orm";
import { authenticate } from "../plugins/auth.js";
import { requireWorkspace } from "../lib/workspace.js";

type AuthRequest = {
  workspaceId: string;
  user: { id: string };
  workspaceMember: { name: string };
};

export async function projectRoutes(app: FastifyInstance) {
  app.addHook("preHandler", authenticate);
  app.addHook("preHandler", requireWorkspace);

  // GET /api/projects
  app.get("/api/projects", async (req, reply) => {
    const workspaceId = (req as unknown as AuthRequest).workspaceId;

    try {
      const rows = await db
        .select()
        .from(projects)
        .where(eq(projects.workspaceId, workspaceId))
        .orderBy(projects.createdAt);

      return reply.send(rows);
    } catch {
      return reply.status(500).send({ error: "Failed to fetch projects" });
    }
  });

  // GET /api/projects/:id
  app.get<{ Params: { id: string } }>(
    "/api/projects/:id",
    async (req, reply) => {
      const workspaceId = (req as unknown as AuthRequest).workspaceId;
      const { id } = req.params;

      try {
        const [project] = await db
          .select()
          .from(projects)
          .where(
            and(
              eq(projects.id, id),
              eq(projects.workspaceId, workspaceId), // never leak other workspaces
            ),
          );

        if (!project)
          return reply.status(404).send({ error: "Project not found" });
        return reply.send(project);
      } catch {
        return reply.status(500).send({ error: "Failed to fetch project" });
      }
    },
  );

  // POST /api/projects
  app.post<{
    Body: {
      name: string;
      description: string;
      emoji: string;
      due?: string;
      tags?: string[];
    };
  }>("/api/projects", async (req, reply) => {
    const workspaceId = (req as unknown as AuthRequest).workspaceId;
    const userId = (req as unknown as AuthRequest).user.id;

    try {
      const [project] = await db
        .insert(projects)
        .values({
          ...req.body,
          workspaceId,
          createdBy: userId,
        })
        .returning();

      // Log activity
      await db.insert(activity).values({
        workspaceId,
        userId,
        actor: (req as unknown as AuthRequest).workspaceMember.name,
        action: "created project",
        target: project.name,
        project: project.name,
        type: "task",
      });

      return reply.status(201).send(project);
    } catch {
      return reply.status(500).send({ error: "Failed to create project" });
    }
  });

  // PATCH /api/projects/:id
  app.patch<{
    Params: { id: string };
    Body: Partial<typeof projects.$inferInsert>;
  }>("/api/projects/:id", async (req, reply) => {
    const workspaceId = (req as unknown as AuthRequest).workspaceId;
    const { id } = req.params;

    try {
      const [updated] = await db
        .update(projects)
        .set({ ...(req.body as object), updatedAt: new Date() })
        .where(and(eq(projects.id, id), eq(projects.workspaceId, workspaceId)))
        .returning();

      if (!updated)
        return reply.status(404).send({ error: "Project not found" });
      return reply.send(updated);
    } catch {
      return reply.status(500).send({ error: "Failed to update project" });
    }
  });

  // DELETE /api/projects/:id
  app.delete<{ Params: { id: string } }>(
    "/api/projects/:id",
    async (req, reply) => {
      const workspaceId = (req as unknown as AuthRequest).workspaceId;
      const { id } = req.params;

      try {
        await db
          .delete(projects)
          .where(
            and(eq(projects.id, id), eq(projects.workspaceId, workspaceId)),
          );

        return reply.status(204).send();
      } catch {
        return reply.status(500).send({ error: "Failed to delete project" });
      }
    },
  );
}
