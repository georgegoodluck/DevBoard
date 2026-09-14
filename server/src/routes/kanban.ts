import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { eq, and, asc } from "drizzle-orm";
import { db } from "../db/index.js";
import { tasks, projects, taskStatusEnum } from "../db/schema.js";
import { requireWorkspace } from "../lib/workspace.js";

const moveSchema = z.object({
  status: z.enum(taskStatusEnum.enumValues),
  // Fractional position, computed client-side as the midpoint between the
  // two cards the dragged card now sits between (or ±1 at column ends).
  position: z.number(),
});

const kanbanRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("preHandler", fastify.authenticate);
  fastify.addHook("preHandler", requireWorkspace);

  // GET /api/projects/:projectId/kanban — tasks grouped by status, each
  // column pre-sorted by position so the frontend can render directly.
  fastify.get<{ Params: { projectId: string } }>("/api/projects/:projectId/kanban", async (request, reply) => {
    const [project] = await db.select({ id: projects.id }).from(projects)
      .where(and(eq(projects.id, request.params.projectId), eq(projects.workspaceId, request.workspaceId!))).limit(1);
    if (!project) return reply.code(404).send({ error: "Project not found" });

    const rows = await db.select().from(tasks)
      .where(eq(tasks.projectId, project.id)).orderBy(asc(tasks.position));

    const columns: Record<string, typeof rows> = { Todo: [], "In Progress": [], "In Review": [], Done: [] };
    for (const row of rows) columns[row.status]!.push(row);

    return reply.send({ columns });
  });

  // PATCH /api/tasks/:id/move — cross-column drag AND reorder-within-column,
  // both expressed as "set status + set fractional position".
  fastify.patch<{ Params: { id: string } }>("/api/tasks/:id/move", async (request, reply) => {
    const parsed = moveSchema.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });

    const [existing] = await db.select({ id: tasks.id }).from(tasks)
      .where(and(eq(tasks.id, request.params.id), eq(tasks.workspaceId, request.workspaceId!))).limit(1);
    if (!existing) return reply.code(404).send({ error: "Task not found" });

    const [task] = await db.update(tasks)
      .set({ status: parsed.data.status, position: parsed.data.position, updatedAt: new Date() })
      .where(eq(tasks.id, request.params.id)).returning();

    return reply.send({ task });
  });
};

export default kanbanRoutes;
