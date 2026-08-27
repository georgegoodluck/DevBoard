import { FastifyRequest, FastifyReply } from "fastify";
import { db } from "../db/index.js";
import { workspaceMembers } from "../db/schema.js";
import { eq } from "drizzle-orm";

export async function getWorkspaceMember(userId: string) {
  const [member] = await db
    .select()
    .from(workspaceMembers)
    .where(eq(workspaceMembers.userId, userId));

  return member ?? null;
}

// Define an extended request type to avoid using 'any'
type WorkspaceRequest = FastifyRequest & {
  user?: { id: string };
  workspaceMember?: NonNullable<Awaited<ReturnType<typeof getWorkspaceMember>>>;
  workspaceId?: string;
};

export async function requireWorkspace(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  // Cast once to our explicitly defined type
  const req = request as WorkspaceRequest;
  const userId = req.user?.id;

  if (!userId) {
    return reply.status(401).send({ error: "Unauthorized" });
  }

  const member = await getWorkspaceMember(userId);

  if (!member) {
    return reply.status(403).send({
      error: "No workspace found",
      code: "NO_WORKSPACE",
    });
  }

  // Attach to request for route handlers safely
  req.workspaceMember = member;
  req.workspaceId = member.workspaceId;
}
