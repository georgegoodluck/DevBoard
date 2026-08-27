import Fastify from "fastify";
import { env } from "./env";
import { corsPlugin } from "./plugins/cors";
import { projectRoutes } from "./routes/projects";
import { taskRoutes } from "./routes/tasks";
import { activityRoutes } from "./routes/activity";
import { workspaceRoutes } from "./routes/workspaces";

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
  await app.register(workspaceRoutes);

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
