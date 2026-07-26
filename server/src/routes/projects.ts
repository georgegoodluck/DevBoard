import { FastifyInstance } from "fastify";
import { db } from "../db";
import { projects } from "../db/schema";
import { eq } from "drizzle-orm";

export async function projectRoutes(app: FastifyInstance) {
  // GET /api/projects
  app.get("/api/projects", async (req, reply) => {
    try {
      const rows = await db.select().from(projects).orderBy(projects.createdAt);
      return reply.send(rows);
    } catch (err) {
      return reply.status(500).send({ error: "Failed to fetch projects" });
    }
  });

  // GET /api/projects/:id
  app.get<{ Params: { id: string } }>(
    "/api/projects/:id",
    async (req, reply) => {
      const { id } = req.params;
      try {
        const [project] = await db
          .select()
          .from(projects)
          .where(eq(projects.id, id));
        if (!project)
          return reply.status(404).send({ error: "Project not found" });
        return reply.send(project);
      } catch (err) {
        return reply.status(500).send({ error: "Failed to fetch project" });
      }
    },
  );

  // POST /api/projects
  app.post<{ Body: typeof projects.$inferInsert }>(
    "/api/projects",
    async (req, reply) => {
      try {
        const [project] = await db
          .insert(projects)
          .values(req.body)
          .returning();
        return reply.send(project);
      } catch (err) {
        return reply.status(500).send({ error: "Failed to create project" });
      }
    },
  );

  // PATCH /api/projects/:id
  app.patch<{
    Params: { id: string };
    Body: Partial<typeof projects.$inferInsert>;
  }>(
    "/api/projects/:id",
    // DB Update
    async (req, reply) => {
      const { id } = req.params;
      try {
        const [updated] = await db
          .update(projects)
          .set({ ...req.body, updatedAt: new Date() })
          .where(eq(projects.id, id))
          .returning();
        if (!updated)
          return reply.status(404).send({ error: "Projects not found" });
        return reply.send(updated);
      } catch (err) {
        return reply.status(500).send({ error: "Failed to update project" });
      }
    },
  );

  // DELETE /api/projects/:id
  app.delete<{ Params: { id: string } }>(
    "/api/projects/:id",
    async (req, reply) => {
      const { id } = req.params;
      try {
        await db.delete(projects).where(eq(projects, id, id));
        return reply.status(204).send();
      } catch (err) {
        return reply.status(500).send({ error: "Failed to delete project" });
      }
    },
  );
}
