import { FastifyInstance } from "fastify";
import { db } from "../db";
import { tasks, members } from "../db/schema";
import { eq, desc } from "drizzle-orm";

export async function taskRoutes(app: FastifyInstance) {
  // GET /api/tasks - Get all tasks with assignee info
  app.get<{ Querystring: { projectId?: string } }>(
    "/api/tasks",
    async (req, reply) => {
      const { projectId } = req.query;
      try {
        const rows = projectId
          ? await db.query.tasks.findMany({
              where: eq(tasks.projectId, projectId),
              with: {
                assignee: true, // This will load the related member
              },
            })
          : await db.query.tasks.findMany({
              with: {
                assignee: true, // This will load the related member
              },
            });

        return reply.send(rows);
      } catch (err) {
        console.error(err);
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
        console.error(err);
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
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(tasks.id, id))
        .returning();

      if (!updated) {
        return reply.status(404).send({
          error: "Task not found",
        });
      }
      return reply.send(updated);
    } catch (err) {
      console.error(err);
      return reply.status(500).send({ error: "Failed to update task" });
    }
  });

  // DELETE /api/tasks/:id
  app.delete<{ Params: { id: string } }>(
    "/api/tasks/:id",
    async (req, reply) => {
      const { id } = req.params;
      try {
        const [deleted] = await db
          .delete(tasks)
          .where(eq(tasks.id, id))
          .returning();

        if (!deleted) {
          return reply.status(404).send({ error: "Task not found" });
        }
        return reply.status(204).send();
      } catch (err) {
        console.error(err);
        return reply.status(500).send({ error: "Failed to delete task" });
      }
    },
  );
}
