import type { FastifyPluginAsync } from "fastify";
import { desc, eq, and } from "drizzle-orm";
import { db } from "../db/index.js";
import { notifications } from "../db/schema.js";
import { requireWorkspace } from "../lib/workspace.js";

const notificationRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("preHandler", fastify.authenticate);
  fastify.addHook("preHandler", requireWorkspace);

  fastify.get("/api/notifications", async (request, reply) => {
    const rows = await db.select().from(notifications)
      .where(and(eq(notifications.workspaceId, request.workspaceId!), eq(notifications.recipientId, request.user!.id)))
      .orderBy(desc(notifications.createdAt)).limit(100);
    return reply.send({ notifications: rows });
  });

  fastify.patch<{ Params: { id: string } }>("/api/notifications/:id/read", async (request, reply) => {
    const [notification] = await db.update(notifications).set({ read: true })
      .where(and(
        eq(notifications.id, request.params.id),
        eq(notifications.workspaceId, request.workspaceId!),
        eq(notifications.recipientId, request.user!.id), // can only mark your own as read
      )).returning();
    if (!notification) return reply.code(404).send({ error: "Notification not found" });
    return reply.send({ notification });
  });

  fastify.patch("/api/notifications/read-all", async (request, reply) => {
    await db.update(notifications).set({ read: true })
      .where(and(eq(notifications.workspaceId, request.workspaceId!), eq(notifications.recipientId, request.user!.id)));
    return reply.send({ ok: true });
  });
};

export default notificationRoutes;
