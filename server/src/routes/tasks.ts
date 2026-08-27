import { FastifyInstance } from "fastify";
import { db } from "../db/index.js";
import { tasks, activity } from "../db/schema.js";
import { eq, and } from "drizzle-orm";
import { authenticate } from "../plugins/auth.js";
import { requireWorkspace } from "../lib/workspace.js";

type AuthRequest = {
  workspaceId: string;
  user: { id: string };
  workspaceMember: { name: string };
};

export async function taskRoutes(app: FastifyInstance) {
  app.addHook("preHandler", authenticate);
  app.addHook("preHandler", requireWorkspace);

  // GET /api/tasks?projectId=xxx
  app.get<{ Querystring: { projectId?: string } }>(
    "/api/tasks",
    async (req, reply) => {
      const workspaceId = (req as unknown as AuthRequest).workspaceId;
      const { projectId } = req.query;

      try {
        const conditions = [eq(tasks.workspaceId, workspaceId)];
        if (projectId) conditions.push(eq(tasks.projectId, projectId));

        const rows = await db
          .select()
          .from(tasks)
          .where(and(...conditions))
          .orderBy(tasks.createdAt);

        return reply.send(rows);
      } catch {
        return reply.status(500).send({ error: "Failed to fetch tasks" });
      }
    },
  );

  // POST /api/tasks
  app.post<{
    Body: {
      title: string;
      projectId: string;
      status?: string;
      priority?: string;
      assigneeId?: string;
      due?: string;
    };
  }>("/api/tasks", async (req, reply) => {
    const workspaceId = (req as unknown as AuthRequest).workspaceId;
    const userId = (req as unknown as AuthRequest).user.id;
    const member = (req as unknown as AuthRequest).workspaceMember;

    try {
      const [task] = await db
        .insert(tasks)
        .values({
          ...req.body,
          workspaceId,
          createdBy: userId,
        } as typeof tasks.$inferInsert)
        .returning();

      // Log activity
      await db.insert(activity).values({
        workspaceId,
        userId,
        actor: member.name,
        action: "created task",
        target: task.title,
        project: req.body.projectId,
        type: "task",
      });

      return reply.status(201).send(task);
    } catch {
      return reply.status(500).send({ error: "Failed to create task" });
    }
  });

  // PATCH /api/tasks/:id
  app.patch<{
    Params: { id: string };
    Body: Partial<typeof tasks.$inferInsert>;
  }>("/api/tasks/:id", async (req, reply) => {
    const workspaceId = (req as unknown as AuthRequest).workspaceId;
    const { id } = req.params;

    try {
      const [updated] = await db
        .update(tasks)
        .set({ ...(req.body as object), updatedAt: new Date() })
        .where(and(eq(tasks.id, id), eq(tasks.workspaceId, workspaceId)))
        .returning();

      if (!updated) return reply.status(404).send({ error: "Task not found" });
      return reply.send(updated);
    } catch {
      return reply.status(500).send({ error: "Failed to update task" });
    }
  });

  // DELETE /api/tasks/:id
  app.delete<{ Params: { id: string } }>(
    "/api/tasks/:id",
    async (req, reply) => {
      const workspaceId = (req as unknown as AuthRequest).workspaceId;
      const { id } = req.params;

      try {
        await db
          .delete(tasks)
          .where(and(eq(tasks.id, id), eq(tasks.workspaceId, workspaceId)));

        return reply.status(204).send();
      } catch {
        return reply.status(500).send({ error: "Failed to delete task" });
      }
    },
  );
}
