import cors from "@fastify/cors";
import fp from "fastify-plugin";
import type { FastifyInstance } from "fastify";
import { env } from "../env.js";

export default fp(async function corsPlugin(fastify: FastifyInstance) {
  await fastify.register(cors, {
    origin: env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });
});
