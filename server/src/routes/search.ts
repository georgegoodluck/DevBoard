import type { FastifyPluginAsync } from "fastify";
import { and, eq, ilike, or } from "drizzle-orm";
import { db } from "../db/index.js";
import { tasks } from "../db/schema.js";
import { requireWorkspace } from "../lib/workspace.js";

const searchRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("preHandler", fastify.authenticate);
  fastify.addHook("preHandler", requireWorkspace);

  // Simple ILIKE search across title + description. Swapped for real
  // full-text search (tsvector + GIN index) in Phase 10 once we're
  // building saved filters and need ranked results.
  fastify.get<{ Querystring: { q?: string; projectId?: string } }>("/api/search", async (request, reply) => {
    const q = request.query.q?.trim();
    if (!q) return reply.send({ tasks: [] });

    const conditions = [
      eq(tasks.workspaceId, request.workspaceId!),
      or(ilike(tasks.title, `%${q}%`), ilike(tasks.description, `%${q}%`))!,
    ];
    if (request.query.projectId) conditions.push(eq(tasks.projectId, request.query.projectId));

    const rows = await db.select().from(tasks).where(and(...conditions)).limit(30);
    return reply.send({ tasks: rows });
  });
};

export default searchRoutes;
