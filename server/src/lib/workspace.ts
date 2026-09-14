import type { FastifyRequest, FastifyReply } from "fastify";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { workspaceMembers } from "../db/schema.js";

// preHandler run after fastify.authenticate. Resolves which workspace the
// caller belongs to and attaches it to the request — routes filter by
// request.workspaceId, never by a workspaceId supplied by the client.
export async function requireWorkspace(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  if (!request.user)
    return reply.code(401).send({ error: "Not authenticated" });

  const [membership] = await db
    .select({
      workspaceId: workspaceMembers.workspaceId,
      role: workspaceMembers.role,
    })
    .from(workspaceMembers)
    .where(eq(workspaceMembers.userId, request.user.id))
    .limit(1);

  if (!membership)
    return reply
      .code(403)
      .send({ error: "No workspace membership found", code: "NO_WORKSPACE" });

  request.workspaceId = membership.workspaceId;
  request.workspaceRole = membership.role;
}

export async function requireAdmin(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  if (request.workspaceRole !== "owner" && request.workspaceRole !== "admin") {
    return reply.code(403).send({ error: "Admin or owner role required" });
  }
}
