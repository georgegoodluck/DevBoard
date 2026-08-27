import { FastifyInstance } from "fastify";
import { db } from "../db";
import { tasks, workspaceMembers } from "../db/schema";
import { eq, and, asc } from "drizzle-orm";
import { authenticate } from "../plugins/auth";
import { requireWorkspace } from "../lib/workspace";

export async function kanbanRoutes(app: FastifyInstance) {
  app.addHook("preHandler", authenticate);
  app.addHook("preHandler", requireWorkspace);

  // GET /api/projects/:projectId/kanban
  // Returns tasks grouped by status, ordered by position
}
