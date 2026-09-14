import Fastify from "fastify";
import { env } from "./env.js";
import corsPlugin from "./plugins/cors.js";
import rateLimitPlugin from "./plugins/rateLimit.js";
import authPlugin from "./plugins/auth.js";
import workspaceRoutes from "./routes/workspaces.js";
import projectRoutes from "./routes/projects.js";
import taskRoutes from "./routes/tasks.js";
import kanbanRoutes from "./routes/kanban.js";
import sprintRoutes from "./routes/sprints.js";
import activityRoutes from "./routes/activity.js";
import notificationRoutes from "./routes/notifications.js";
import githubRoutes from "./routes/github.js";
import searchRoutes from "./routes/search.js";

const fastify = Fastify({
  logger: env.NODE_ENV === "development" ? { transport: { target: "pino-pretty" } } : true,
});

await fastify.register(corsPlugin);
await fastify.register(rateLimitPlugin);
await fastify.register(authPlugin);

fastify.get("/health", async () => ({ status: "ok" }));

await fastify.register(workspaceRoutes);
await fastify.register(projectRoutes);
await fastify.register(taskRoutes);
await fastify.register(kanbanRoutes);
await fastify.register(sprintRoutes);
await fastify.register(activityRoutes);
await fastify.register(notificationRoutes);
await fastify.register(githubRoutes);
await fastify.register(searchRoutes);

try {
  await fastify.listen({ port: env.PORT, host: "0.0.0.0" });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
