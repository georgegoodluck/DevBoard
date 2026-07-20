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
}
