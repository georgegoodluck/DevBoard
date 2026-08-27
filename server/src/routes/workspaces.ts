import { FastifyInstance } from "fastify";
import { db } from "../db/index.js";
import { workspaces, workspaceMembers, invites } from "../db/schema.js";
import { eq, and } from "drizzle-orm";
import { authenticate } from "../plugins/auth.js";
import { requireWorkspace, getWorkspaceMember } from "../lib/workspace.js";
import crypto from "crypto";

type AuthRequest = {
  workspaceId: string;
  user: {
    id: string;
    email: string;
    user_metadata?: {
      full_name?: string;
    };
  };
  workspaceMember: {
    name: string;
    role: string;
  };
};

export async function workspaceRoutes(app: FastifyInstance) {
  // POST /api/workspaces
  // Called during onboarding — creates workspace and sets user as owner
  // No requireWorkspace here — user doesn't have one yet
  app.post<{
    Body: { name: string; slug: string };
  }>("/api/workspaces", { preHandler: [authenticate] }, async (req, reply) => {
    const userId = (req as unknown as AuthRequest).user.id;
    const user = (req as unknown as AuthRequest).user;

    // Check user doesn't already have a workspace
    const existing = await getWorkspaceMember(userId);
    if (existing) {
      return reply.status(409).send({ error: "Already in a workspace" });
    }

    // Check slug is available
    const [slugTaken] = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.slug, req.body.slug));

    if (slugTaken) {
      return reply.status(409).send({ error: "Slug already taken" });
    }

    try {
      // Create workspace
      const [workspace] = await db
        .insert(workspaces)
        .values({
          name: req.body.name,
          slug: req.body.slug,
          ownerUserId: userId,
        })
        .returning();

      // Add user as owner member
      const fullName = user.user_metadata?.full_name ?? user.email ?? "User";
      const initials = fullName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

      await db.insert(workspaceMembers).values({
        workspaceId: workspace.id,
        userId,
        name: fullName,
        email: user.email,
        initials,
        role: "owner",
        online: true,
      });

      return reply.status(201).send(workspace);
    } catch {
      return reply.status(500).send({ error: "Failed to create workspace" });
    }
  });

  // GET /api/workspaces/me
  // Returns current user's workspace + their member record
  app.get(
    "/api/workspaces/me",
    {
      preHandler: [authenticate, requireWorkspace],
    },
    async (req, reply) => {
      const workspaceId = (req as unknown as AuthRequest).workspaceId;

      try {
        const [workspace] = await db
          .select()
          .from(workspaces)
          .where(eq(workspaces.id, workspaceId));

        const members = await db
          .select()
          .from(workspaceMembers)
          .where(eq(workspaceMembers.workspaceId, workspaceId));

        return reply.send({
          workspace,
          members,
          currentMember: (req as unknown as AuthRequest).workspaceMember,
        });
      } catch {
        return reply.status(500).send({ error: "Failed to fetch workspace" });
      }
    },
  );

  // POST /api/workspaces/invite
  // Send an invite to an email address
  app.post<{
    Body: { email: string; role?: "admin" | "member" };
  }>(
    "/api/workspaces/invite",
    {
      preHandler: [authenticate, requireWorkspace],
    },
    async (req, reply) => {
      const workspaceId = (req as unknown as AuthRequest).workspaceId;
      const userId = (req as unknown as AuthRequest).user.id;
      const member = (req as unknown as AuthRequest).workspaceMember;

      // Only owners and admins can invite
      if (!["owner", "admin"].includes(member.role)) {
        return reply
          .status(403)
          .send({ error: "Only admins can send invites" });
      }

      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      try {
        const [invite] = await db
          .insert(invites)
          .values({
            workspaceId,
            email: req.body.email,
            role: req.body.role ?? "member",
            token,
            invitedBy: userId,
            expiresAt,
          })
          .returning();

        // In production: send email with invite link here
        // e.g. https://devboard.app/invite?token=xxx
        const inviteLink = `${process.env.FRONTEND_URL}/invite?token=${token}`;

        return reply.status(201).send({ invite, inviteLink });
      } catch {
        return reply.status(500).send({ error: "Failed to create invite" });
      }
    },
  );

  // POST /api/workspaces/invite/accept
  // Called when an invited user signs up and accepts
  app.post<{
    Body: { token: string };
  }>(
    "/api/workspaces/invite/accept",
    {
      preHandler: [authenticate],
    },
    async (req, reply) => {
      const userId = (req as unknown as AuthRequest).user.id;
      const user = (req as unknown as AuthRequest).user;

      // Find the invite
      const [invite] = await db
        .select()
        .from(invites)
        .where(
          and(eq(invites.token, req.body.token), eq(invites.status, "pending")),
        );

      if (!invite) {
        return reply.status(404).send({ error: "Invalid or expired invite" });
      }

      if (new Date() > invite.expiresAt) {
        await db
          .update(invites)
          .set({ status: "expired" })
          .where(eq(invites.id, invite.id));
        return reply.status(410).send({ error: "Invite has expired" });
      }

      try {
        const fullName = user.user_metadata?.full_name ?? user.email ?? "User";
        const initials = fullName
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);

        // Add user to workspace
        await db.insert(workspaceMembers).values({
          workspaceId: invite.workspaceId,
          userId,
          name: fullName,
          email: user.email,
          initials,
          role: invite.role,
          online: true,
        });

        // Mark invite as accepted
        await db
          .update(invites)
          .set({ status: "accepted" })
          .where(eq(invites.id, invite.id));

        return reply.send({ success: true, workspaceId: invite.workspaceId });
      } catch {
        return reply.status(500).send({ error: "Failed to accept invite" });
      }
    },
  );
}
