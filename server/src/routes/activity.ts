import { FastifyInstance } from "fastify";
import { db } from "../db";
import { activity } from "../db/schema";
import { eq, desc } from "drizzle-orm";

export async function activityRoutes(app: FastifyInstance) {
  // GET /api/activity
  app.get("/api/activity", async (req, reply) => {
    try {
      const rows = await db
        .select()
        .from(activity)
        .orderBy(desc(activity.createdAt))
        .limit(50);
      return reply.send(rows);
    } catch (err) {
      return reply.status(500).send({ error: "Failed to fetch activity" });
    }
  });

  //   POST /api/activity
  app.post<{ Body: typeof activity.$inferInsert }>(
    "/api/activity",
    async (req, reply) => {
      try {
        const [event] = await db.insert(activity).values(req.body).returning();
        return reply.status(201).send(event);
      } catch (err) {
        return reply
          .status(500)
          .send({ error: "Failed to create activity event" });
      }
    },
  );
}
