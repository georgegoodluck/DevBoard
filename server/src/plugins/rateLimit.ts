import rateLimit from "@fastify/rate-limit";
import fp from "fastify-plugin";
import type { FastifyInstance } from "fastify";
import { env } from "../env.js";

export default fp(async function rateLimitPlugin(fastify: FastifyInstance) {
  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute",
    // Global rate limiting runs as onRequest, before any preHandler — so
    // request.user is never set here; this always keys by IP.
    keyGenerator: (request) => request.ip,
    allowList: env.NODE_ENV === "development" ? ["127.0.0.1", "::1"] : [],
  });
});
