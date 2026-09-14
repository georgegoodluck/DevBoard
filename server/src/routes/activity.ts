import type { FastifyPluginAsync } from "fastify";
import { desc, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { activity } from "../db/schema.js";
import { requireWorkspace } from "../lib/workspace.js";

const activityRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("preHandler", fastify.authenticate);
  fastify.addHook("preHandler", requireWorkspace);

  fastify.get<{ Querystring: { limit?: string } }>("/api/activity", async (request, reply) => {
    const limit = Math.min(Number(request.query.limit) || 50, 200);
    const rows = await db.select().from(activity)
      .where(eq(activity.workspaceId, request.workspaceId!))
      .orderBy(desc(activity.createdAt)).limit(limit);
    return reply.send({ activity: rows });
  });
};

export default activityRoutes;
