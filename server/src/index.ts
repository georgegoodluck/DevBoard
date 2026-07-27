import Fastify from "fastify";
import { env } from "./env";
import { corsPlugin } from "./plugins/cors";
import { projectRoutes } from "./routes/projects";
import { taskRoutes } from "./routes/tasks";
import { activityRoutes } from "./routes/activity";

const app = Fastify({ logger: true });

async function main() {
  // Plugins FIRST — always before routes
  await corsPlugin(app);

  // Then routes
  await app.register(projectRoutes);
  await app.register(taskRoutes);
  await app.register(activityRoutes);

  app.get("/health", async () => ({ status: "ok" }));

  await app.listen({ port: env.PORT, host: "0.0.0.0" });
  console.log(`Server running on http://localhost:${env.PORT}`);
}

main();
