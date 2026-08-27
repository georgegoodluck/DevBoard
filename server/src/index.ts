import * as Sentry from "@sentry/node";
import { workspaceRoutes } from "./routes/workspaces.js";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  enabled: process.env.NODE_ENV === "production",
});

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
