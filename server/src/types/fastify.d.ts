import "fastify";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>;
  }
  interface FastifyRequest {
    user?: { id: string; email: string | undefined };
    workspaceId?: string;
    workspaceRole?: "owner" | "admin" | "member";
    rawBody?: Buffer;
  }
}
