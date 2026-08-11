import * as Sentry from "@sentry/node";

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

// Capture unhandled errors in Fastify and report to Sentry
app.setErrorHandler((error, request, reply) => {
  Sentry.captureException(error);
  app.log.error(error);
  reply.status(error.statusCode || 500).send({
    error: error.name || "Internal Server Error",
    message: error.message,
  });
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
  } catch (err) {
    Sentry.captureException(err);
    app.log.error(err);
    process.exit(1);
  }
}

main();
