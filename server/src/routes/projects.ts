import { FastifyInstance } from "fastify";
import { db } from "../db";
import { projects, projectMembers, members } from "../db/schema";
import { eq } from "drizzle-orm";
import { authenticate } from "../plugins/auth";

export async function projectRoutes(app: FastifyInstance) {
  // All project routes require authentication
  app.addHook("preHandler", authenticate);

  // GET /api/projects
  app.get("/api/projects", async (req, reply) => {
    try {
      // Fetch all projects ordered by creation date
      const rows = await db.select().from(projects).orderBy(projects.createdAt);

      // For each project, fetch its associated members
      const result = await Promise.all(
        rows.map(async (project) => {
          // Query project members with their details
          const projectMemberRows = await db
            .select({ member: members })
            .from(projectMembers)
            .innerJoin(members, eq(projectMembers.memberId, members.id))
            .where(eq(projectMembers.projectId, project.id));

          // Return project with member initials and gradients
          return {
            ...project,
            members: projectMemberRows.map((r) => ({
              initials: r.member.initials,
              gradient: r.member.gradient,
            })),
          };
        }),
      );

      return reply.send(result);
    } catch (err) {
      return reply.status(500).send({ error: "Failed to fetch projects" });
    }
  });

  // --------------------------------------------------------------------------
  // GET /api/projects/:id - Fetch a single project by ID
  // --------------------------------------------------------------------------
  app.get<{ Params: { id: string } }>(
    "/api/projects/:id",
    async (req, reply) => {
      const { id } = req.params;
      try {
        // Fetch the project
        const [project] = await db
          .select()
          .from(projects)
          .where(eq(projects.id, id));

        if (!project) {
          return reply.status(404).send({ error: "Project not found" });
        }

        // Fetch project members
        const projectMemberRows = await db
          .select({ member: members })
          .from(projectMembers)
          .innerJoin(members, eq(projectMembers.memberId, members.id))
          .where(eq(projectMembers.projectId, project.id));

        // Return project with members
        return reply.send({
          ...project,
          members: projectMemberRows.map((r) => ({
            initials: r.member.initials,
            gradient: r.member.gradient,
          })),
        });
      } catch (err) {
        return reply.status(500).send({ error: "Failed to fetch project" });
      }
    },
  );

  // --------------------------------------------------------------------------
  // POST /api/projects - Create a new project
  // --------------------------------------------------------------------------
  app.post<{ Body: typeof projects.$inferInsert }>(
    "/api/projects",
    async (req, reply) => {
      try {
        const [project] = await db
          .insert(projects)
          .values(req.body)
          .returning();

        // Return the created project (without members initially)
        return reply.status(201).send({
          ...project,
          members: [],
        });
      } catch (err) {
        return reply.status(500).send({ error: "Failed to create project" });
      }
    },
  );

  // --------------------------------------------------------------------------
  // PATCH /api/projects/:id - Update a project
  // --------------------------------------------------------------------------
  app.patch<{
    Params: { id: string };
    Body: Partial<typeof projects.$inferInsert>;
  }>("/api/projects/:id", async (req, reply) => {
    const { id } = req.params;
    try {
      const [updated] = await db
        .update(projects)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(projects.id, id))
        .returning();
      if (!updated)
        return reply.status(404).send({ error: "Project not found" });
      return reply.send(updated);
    } catch (err) {
      return reply.status(500).send({ error: "Failed to update project" });
    }
  });

      // Fetch updated project with members
      const projectMemberRows = await db
        .select({ member: members })
        .from(projectMembers)
        .innerJoin(members, eq(projectMembers.memberId, members.id))
        .where(eq(projectMembers.projectId, updated.id));

      return reply.send({
        ...updated,
        members: projectMemberRows.map((r) => ({
          initials: r.member.initials,
          gradient: r.member.gradient,
        })),
      });
    } catch (err) {
      return reply.status(500).send({ error: "Failed to update project" });
    }
  });

  // --------------------------------------------------------------------------
  // DELETE /api/projects/:id - Delete a project
  // --------------------------------------------------------------------------
  app.delete<{ Params: { id: string } }>(
    "/api/projects/:id",
    async (req, reply) => {
      const { id } = req.params;
      try {
        await db.delete(projects).where(eq(projects.id, id));
        return reply.status(204).send();
      } catch (err) {
        return reply.status(500).send({ error: "Failed to delete project" });
      }
    },
  );
}
