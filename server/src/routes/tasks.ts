import { FastifyInstance } from "fastify";
import { db } from "../db";
import { tasks } from "../db/schema";
import { eq } from "drizzle-orm";

export async function taskRoutes(app: FastifyInstance) {
  // GET /api/tasks?projectId=xxx (projectId is optional)
  app.get<{ Querystring: { projectId?: string } }>(
    "/api/tasks",
    async (req, reply) => {
      const { projectId } = req.query;
      try {
        const rows = projectId
          ? await db.select().from(tasks).where(eq(tasks.projectId, projectId))
          : await db.select().from(tasks).orderBy(tasks.createdAt);
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
        return reply.status(201).send(task);
      } catch (err) {
        return reply.status(500).send({ error: "Failed to create task" });
      }
    },
  );

  // PATCH /api/tasks/:id
  app.patch<{
    Params: { id: string };
    Body: Partial<typeof tasks.$inferInsert>;
  }>("/api/tasks/:id", async (req, reply) => {
    const { id } = req.params;
    try {
      const [updated] = await db
        .update(tasks)
        .set(req.body)
        .where(eq(tasks.id, id))
        .returning();
      if (!updated) return reply.status(404).send({ error: "Task not found" });
      return reply.send(updated);
    } catch (err) {
      return reply.status(500).send({ error: "Failed to update task" });
    }
  });

  // DELETE /api/tasks/:id
  app.delete<{ Params: { id: string } }>(
    "/api/tasks/:id",
    async (req, reply) => {
      const { id } = req.params;
      try {
        await db.delete(tasks).where(eq(tasks.id, id));
        return reply.status(204).send();
      } catch (err) {
        return reply.status(500).send({ error: "Failed to delete task" });
      }
    },
  );
}
