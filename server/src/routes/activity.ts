import { FastifyInstance } from "fastify";
import { db } from "../db/index.js";
import { activity } from "../db/schema.js";
import { eq, desc } from "drizzle-orm";
import { authenticate } from "../plugins/auth.js";
import { requireWorkspace } from "../lib/workspace.js";

type AuthRequest = {
  workspaceId: string;
};

export async function activityRoutes(app: FastifyInstance) {
  app.addHook("preHandler", authenticate);
  app.addHook("preHandler", requireWorkspace);

  // GET /api/activity
  app.get("/api/activity", async (req, reply) => {
    const workspaceId = (req as unknown as AuthRequest).workspaceId;

    try {
      const rows = await db
        .select()
        .from(activity)
        .where(eq(activity.workspaceId, workspaceId))
        .orderBy(desc(activity.createdAt))
        .limit(50);

      return reply.send(rows);
    } catch {
      return reply.status(500).send({ error: "Failed to fetch activity" });
    }
  });
}
