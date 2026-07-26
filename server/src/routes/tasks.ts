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
}
