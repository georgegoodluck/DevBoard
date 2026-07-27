import Fastify from "fastify";
import { env } from "./env";
import { corsPlugin } from "./plugins/cors";
import { projectRoutes } from "./routes/projects";
import { taskRoutes } from "./routes/tasks";
import { activityRoutes } from "./routes/activity";

const app = Fastify({ logger: true });

async function main() {
  // Register plugins
  await corsPlugin(app); // Configures CORS middleware so frontend clients can communicate with the API

  // Register routes
  await app.register(projectRoutes);
  await app.register(taskRoutes);
  await app.register(activityRoutes);

  // Health check
  app.get("/health", async () => ({ status: "ok" }));

  // Start server
  try {
    await app.listen({ port: env.PORT, host: "0.0.0.0" });
    console.log(`Server running on http://localhost:${env.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

main();
