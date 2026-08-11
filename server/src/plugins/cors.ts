import { FastifyInstance } from "fastify";
import cors from "@fastify/cors";

const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

export async function corsPlugin(app: FastifyInstance) {
  await app.register(cors, {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  });
}
