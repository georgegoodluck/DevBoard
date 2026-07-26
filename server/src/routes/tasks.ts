import { FastifyInstance } from "fastify";
import { db } from "../db";
import { projects, tasks } from "../db/schema";
import { eq } from "drizzle-orm";

export async function taskRoutes(app: FastifyInstance) {
  // GET /api/tasks
  app.get("/api/tasks", async (req, reply) => {
    try {
      const rows = await db.select().from(tasks).orderBy(tasks.createdAt);
      return reply.send(rows);
    } catch (err) {
      return reply.status(500).send({ error: "Failed to fetch tasks" });
    }
  });

  // GET /api/tasks?projectId=xxx - fetch tasks by their id
  app.get<{ Querystring: { projectId: string } }>(
    "/api/tasks",
    async (req, reply) => {
      // Extract projectId from incoming URL
      const { projectId } = req.query;
      try {
        const rows = projectId
          ? await db.select().from(tasks).where(eq(tasks.projectId, projectId))
          : await db.select().from(tasks);
        return reply.send(rows);
      } catch (err) {
        return reply.status(500).send({ error: "Failed to fetch tasks" });
      }
    },
  );

  // POST /api/tasks
  app.post<{ Body: typeof tasks.$inferInsert }>(
    "/api/tasks",
    async (req, reply) => {
      try {
        const [task] = await db.insert(tasks).values(req.body).returning();
        return reply.send(task);
      } catch (err) {
        return reply.status(500).send({ error: "Failed to create task" });
      }
    },
  );

  // PATCH /api/tasks/:id
  app.patch<{
    Params: { id: string };
    // Defines the request body shape
    Body: Partial<typeof tasks.$inferInsert>;
  }>(
    "/api/tasks/:id",
    // DB Update
    async (req, reply) => {
      const { id } = req.params;
      try {
        const [updated] = await db
          .update(tasks)
          .set(req.body)
          .where(eq(tasks.id, id))
          .returning();
        if (!updated)
          return reply.status(404).send({
            error: "Projects not found",
          });
        return reply.send(updated);
      } catch (err) {
        return reply.status(500).send({ error: "Failed to update task" });
      }
    },
  );
}
