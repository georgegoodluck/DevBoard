import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { db } from "../db/index.js";
import { sprints, sprintTasks, tasks, projects } from "../db/schema.js";
import { requireWorkspace } from "../lib/workspace.js";

const createSprintSchema = z.object({
  projectId: z.string().uuid(),
  name: z.string().trim().min(1).max(100),
  goal: z.string().trim().max(500).optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});
const updateSprintSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  goal: z.string().trim().max(500).optional(),
  status: z.enum(["planned", "active", "completed"]).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});
const addSprintTaskSchema = z.object({
  taskId: z.string().uuid(),
  storyPoints: z.number().int().min(0).max(100).default(0),
});

const sprintRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("preHandler", fastify.authenticate);
  fastify.addHook("preHandler", requireWorkspace);

  fastify.get<{ Querystring: { projectId?: string } }>(
    "/api/sprints",
    async (request, reply) => {
      const conditions = [eq(sprints.workspaceId, request.workspaceId!)];
      if (request.query.projectId)
        conditions.push(eq(sprints.projectId, request.query.projectId));
      const rows = await db
        .select()
        .from(sprints)
        .where(and(...conditions));
      return reply.send({ sprints: rows });
    },
  );

  fastify.post("/api/sprints", async (request, reply) => {
    const parsed = createSprintSchema.safeParse(request.body);
    if (!parsed.success)
      return reply.code(400).send({ error: parsed.error.flatten() });

    const [project] = await db
      .select({ id: projects.id })
      .from(projects)
      .where(
        and(
          eq(projects.id, parsed.data.projectId),
          eq(projects.workspaceId, request.workspaceId!),
        ),
      )
      .limit(1);
    if (!project) return reply.code(404).send({ error: "Project not found" });

    const [sprint] = await db
      .insert(sprints)
      .values({ ...parsed.data, workspaceId: request.workspaceId! })
      .returning();
    return reply.code(201).send({ sprint });
  });

  fastify.patch<{ Params: { id: string } }>(
    "/api/sprints/:id",
    async (request, reply) => {
      const parsed = updateSprintSchema.safeParse(request.body);
      if (!parsed.success)
        return reply.code(400).send({ error: parsed.error.flatten() });

      const [existing] = await db
        .select()
        .from(sprints)
        .where(
          and(
            eq(sprints.id, request.params.id),
            eq(sprints.workspaceId, request.workspaceId!),
          ),
        )
        .limit(1);
      if (!existing) return reply.code(404).send({ error: "Sprint not found" });

      // Completing a sprint moves its incomplete tasks back to the backlog
      // (i.e. removes them from sprint_tasks) — per the spec's Phase 9 rule.
      if (
        parsed.data.status === "completed" &&
        existing.status !== "completed"
      ) {
        const rows = await db
          .select({ taskId: sprintTasks.taskId, status: tasks.status })
          .from(sprintTasks)
          .innerJoin(tasks, eq(tasks.id, sprintTasks.taskId))
          .where(eq(sprintTasks.sprintId, existing.id));
        const toRemove = rows
          .filter((r) => r.status !== "Done")
          .map((r) => r.taskId);
        for (const taskId of toRemove) {
          await db
            .delete(sprintTasks)
            .where(
              and(
                eq(sprintTasks.sprintId, existing.id),
                eq(sprintTasks.taskId, taskId),
              ),
            );
        }
      }

      const [sprint] = await db
        .update(sprints)
        .set({ ...parsed.data, updatedAt: new Date() })
        .where(eq(sprints.id, request.params.id))
        .returning();
      return reply.send({ sprint });
    },
  );

  // NEW: list all tasks in a sprint, with story points (for velocity chart & sprint board)
  fastify.get<{ Params: { id: string } }>(
    "/api/sprints/:id/tasks",
    async (request, reply) => {
      const [sprint] = await db
        .select({ id: sprints.id })
        .from(sprints)
        .where(
          and(
            eq(sprints.id, request.params.id),
            eq(sprints.workspaceId, request.workspaceId!),
          ),
        )
        .limit(1);
      if (!sprint) return reply.code(404).send({ error: "Sprint not found" });

      const rows = await db
        .select({
          id: sprintTasks.id,
          taskId: sprintTasks.taskId,
          storyPoints: sprintTasks.storyPoints,
          title: tasks.title,
          status: tasks.status,
        })
        .from(sprintTasks)
        .innerJoin(tasks, eq(tasks.id, sprintTasks.taskId))
        .where(eq(sprintTasks.sprintId, sprint.id));

      return reply.send({ sprintTasks: rows });
    },
  );

  fastify.post<{ Params: { id: string } }>(
    "/api/sprints/:id/tasks",
    async (request, reply) => {
      const parsed = addSprintTaskSchema.safeParse(request.body);
      if (!parsed.success)
        return reply.code(400).send({ error: parsed.error.flatten() });

      const [sprint] = await db
        .select({ id: sprints.id })
        .from(sprints)
        .where(
          and(
            eq(sprints.id, request.params.id),
            eq(sprints.workspaceId, request.workspaceId!),
          ),
        )
        .limit(1);
      if (!sprint) return reply.code(404).send({ error: "Sprint not found" });

      const [task] = await db
        .select({ id: tasks.id })
        .from(tasks)
        .where(
          and(
            eq(tasks.id, parsed.data.taskId),
            eq(tasks.workspaceId, request.workspaceId!),
          ),
        )
        .limit(1);
      if (!task) return reply.code(404).send({ error: "Task not found" });

      const [sprintTask] = await db
        .insert(sprintTasks)
        .values({
          sprintId: sprint.id,
          taskId: task.id,
          storyPoints: parsed.data.storyPoints,
        })
        .returning();
      return reply.code(201).send({ sprintTask });
    },
  );

  fastify.delete<{ Params: { id: string; taskId: string } }>(
    "/api/sprints/:id/tasks/:taskId",
    async (request, reply) => {
      const [sprint] = await db
        .select({ id: sprints.id })
        .from(sprints)
        .where(
          and(
            eq(sprints.id, request.params.id),
            eq(sprints.workspaceId, request.workspaceId!),
          ),
        )
        .limit(1);
      if (!sprint) return reply.code(404).send({ error: "Sprint not found" });

      await db
        .delete(sprintTasks)
        .where(
          and(
            eq(sprintTasks.sprintId, sprint.id),
            eq(sprintTasks.taskId, request.params.taskId),
          ),
        );
      return reply.code(204).send();
    },
  );
};

export default sprintRoutes;
