import Fastify from "fastify";
import { env } from "./env.js";
import { corsPlugin } from "./plugins/cors.js";
import { projectRoutes } from "./routes/projects.js";
import { taskRoutes } from "./routes/tasks.js";
import { activityRoutes } from "./routes/activity.js";

const app = Fastify({
  logger:
    process.env.NODE_ENV === "production"
      ? true
      : { transport: { target: "pino-pretty" } },
});

async function main() {
  // Plugins FIRST — always before routes
  await corsPlugin(app);

  // Then routes
  await app.register(projectRoutes);
  await app.register(taskRoutes);
  await app.register(activityRoutes);

  app.get("/health", async () => ({
    status: "ok",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
  }));
  try {
    await app.listen({ port: env.PORT, host: "0.0.0.0" });
    // console.log(`Server running on http://localhost:${env.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}
main();
