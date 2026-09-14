import type { FastifyPluginAsync } from "fastify";
import { randomBytes } from "node:crypto";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { db } from "../db/index.js";
import { workspaces, workspaceMembers, invites } from "../db/schema.js";
import { requireWorkspace, requireAdmin } from "../lib/workspace.js";
import { sendInviteEmail } from "../lib/email.js";
import { createNotification } from "../lib/notifications.js";

const createWorkspaceSchema = z.object({
  name: z.string().trim().min(2).max(60),
  slug: z.string().trim().toLowerCase().regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, hyphens only").min(2).max(40),
  memberName: z.string().trim().min(1).max(80),
});
const inviteSchema = z.object({ email: z.string().trim().toLowerCase().email(), role: z.enum(["admin", "member"]) });
const acceptInviteSchema = z.object({ token: z.string().min(1) });

function initialsOf(name: string): string {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]!.toUpperCase()).join("");
}

const workspaceRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post("/api/workspaces", { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const parsed = createWorkspaceSchema.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });
    const { name, slug, memberName } = parsed.data;
    const user = request.user!;

    const [existingSlug] = await db.select({ id: workspaces.id }).from(workspaces).where(eq(workspaces.slug, slug)).limit(1);
    if (existingSlug) return reply.code(409).send({ error: "That workspace URL is already taken" });

    const [existingMembership] = await db.select({ id: workspaceMembers.id }).from(workspaceMembers).where(eq(workspaceMembers.userId, user.id)).limit(1);
    if (existingMembership) return reply.code(409).send({ error: "You already belong to a workspace" });

    const [workspace] = await db.insert(workspaces).values({ name, slug, ownerUserId: user.id }).returning();
    if (!workspace) return reply.code(500).send({ error: "Failed to create workspace" });

    await db.insert(workspaceMembers).values({
      workspaceId: workspace.id, userId: user.id, name: memberName, email: user.email ?? "",
      initials: initialsOf(memberName), role: "owner", online: true,
    });

    return reply.code(201).send({ workspace });
  });

  fastify.get("/api/workspaces/me", { preHandler: [fastify.authenticate, requireWorkspace] }, async (request, reply) => {
    const [workspace] = await db.select().from(workspaces).where(eq(workspaces.id, request.workspaceId!)).limit(1);
    if (!workspace) return reply.code(404).send({ error: "Workspace not found" });
    const members = await db.select().from(workspaceMembers).where(eq(workspaceMembers.workspaceId, request.workspaceId!));
    return reply.send({ workspace, members, role: request.workspaceRole });
  });

  fastify.post("/api/workspaces/invite", { preHandler: [fastify.authenticate, requireWorkspace, requireAdmin] }, async (request, reply) => {
    const parsed = inviteSchema.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });
    const { email, role } = parsed.data;
    const workspaceId = request.workspaceId!;

    const [alreadyMember] = await db.select({ id: workspaceMembers.id }).from(workspaceMembers)
      .where(and(eq(workspaceMembers.workspaceId, workspaceId), eq(workspaceMembers.email, email))).limit(1);
    if (alreadyMember) return reply.code(409).send({ error: "This person is already a member" });

    const [workspace] = await db.select({ name: workspaces.name }).from(workspaces).where(eq(workspaces.id, workspaceId)).limit(1);
    const [inviter] = await db.select({ name: workspaceMembers.name }).from(workspaceMembers).where(eq(workspaceMembers.userId, request.user!.id)).limit(1);

    const token = randomBytes(24).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const [invite] = await db.insert(invites).values({ workspaceId, email, role, token, invitedBy: request.user!.id, expiresAt }).returning();
    await sendInviteEmail({ to: email, workspaceName: workspace?.name ?? "DevBoard", inviterName: inviter?.name ?? "A teammate", token });

    return reply.code(201).send({ invite });
  });

  fastify.post("/api/workspaces/invite/accept", { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const parsed = acceptInviteSchema.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });
    const user = request.user!;

    const [invite] = await db.select().from(invites).where(eq(invites.token, parsed.data.token)).limit(1);
    if (!invite) return reply.code(404).send({ error: "Invite not found" });
    if (invite.status !== "pending") return reply.code(410).send({ error: `This invite was already ${invite.status}` });
    if (invite.expiresAt.getTime() < Date.now()) {
      await db.update(invites).set({ status: "expired" }).where(eq(invites.id, invite.id));
      return reply.code(410).send({ error: "This invite has expired" });
    }
    if (user.email?.toLowerCase() !== invite.email.toLowerCase()) {
      return reply.code(403).send({ error: "This invite was sent to a different email address" });
    }

    const memberName = user.email?.split("@")[0] ?? "New member";
    await db.insert(workspaceMembers).values({
      workspaceId: invite.workspaceId, userId: user.id, name: memberName, email: invite.email,
      initials: initialsOf(memberName), role: invite.role,
    });
    await db.update(invites).set({ status: "accepted" }).where(eq(invites.id, invite.id));

    await createNotification({
      workspaceId: invite.workspaceId, recipientId: invite.invitedBy, type: "invite_accepted",
      title: `${memberName} accepted your invite`, actorId: user.id, actorName: memberName,
    });

    return reply.send({ workspaceId: invite.workspaceId });
  });
};

export default workspaceRoutes;
