import Fastify from "fastify";
import { env } from "./env";
import { corsPlugin } from "./plugins/cors";
import { projectRoutes } from "./routes/projects";
import { taskRoutes } from "./routes/tasks";
import { activityRoutes } from "./routes/activity";



