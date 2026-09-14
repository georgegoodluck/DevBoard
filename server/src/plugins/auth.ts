import fp from "fastify-plugin";
import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { supabaseAdmin } from "../lib/supabase.js";

export default fp(async function authPlugin(fastify: FastifyInstance) {
  fastify.decorate(
    "authenticate",
    async function authenticate(request: FastifyRequest, reply: FastifyReply) {
      const authHeader = request.headers.authorization;
      if (!authHeader?.startsWith("Bearer ")) {
        return reply
          .code(401)
          .send({ error: "Missing or malformed Authorization header" });
      }
      const token = authHeader.slice("Bearer ".length);
      const { data, error } = await supabaseAdmin.auth.getUser(token);
      if (error || !data.user)
        return reply.code(401).send({ error: "Invalid or expired token" });
      request.user = { id: data.user.id, email: data.user.email };
    },
  );
});
