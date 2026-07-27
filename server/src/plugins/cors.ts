import { FastifyInstance } from "fastify";
import cors from "@fastify/cors";

export async function corsPlugin(app: FastifyInstance) {
  await app.register(cors, {
    origin: ["https://localhost:3000"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  });
}
