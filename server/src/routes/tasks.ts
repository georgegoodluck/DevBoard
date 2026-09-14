import type { FastifyPluginAsync } from "fastify";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { db } from "../db/index.js";
import {
  tasks, subtasks, taskComments, taskDependencies, projects,
  taskStatusEnum, taskPriorityEnum,
} from "../db/schema.js";
import { requireWorkspace } from "../lib/workspace.js";
import { createNotification } from "../lib/notifications.js";

const createTaskSchema = z.object({
  projectId: z.string().uuid(),
  assigneeId: z.string().uuid().optional(),
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(5000).optional(),
  status: z.enum(taskStatusEnum.enumValues).optional(),
  priority: z.enum(taskPriorityEnum.enumValues).optional(),
  due: z.coerce.date().optional(),
  labels: z.array(z.string().trim().max(30)).max(10).optional(),
});
const updateTaskSchema = createTaskSchema.partial().omit({ projectId: true });
const subtaskSchema = z.object({ title: z.string().trim().min(1).max(200) });
const commentSchema = z.object({ body: z.string().trim().min(1).max(5000) });
const dependencySchema = z.object({ blockeeId: z.string().uuid() });

// Matches lib/github.ts extractExternalRef — 8 hex chars, unique enough to
// find in a branch name or commit message.
function newExternalRef(): string {
  return randomUUID().replace(/-/g, "").slice(0, 8);
}

const taskRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("preHandler", fastify.authenticate);
  fastify.addHook("preHandler", requireWorkspace);

  // ── Tasks ────────────────────────────────────────────
  fastify.get<{ Querystring: { projectId?: string } }>("/api/tasks", async (request, reply) => {
    const conditions = [eq(tasks.workspaceId, request.workspaceId!)];
    if (request.query.projectId) conditions.push(eq(tasks.projectId, request.query.projectId));
    const rows = await db.select().from(tasks).where(and(...conditions));
    return reply.send({ tasks: rows });
  });

  fastify.post("/api/tasks", async (request, reply) => {
    const parsed = createTaskSchema.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });

    // Confirm the project belongs to this workspace — never trust the
    // client-supplied projectId on its own.
    const [project] = await db.select({ id: projects.id }).from(projects)
      .where(and(eq(projects.id, parsed.data.projectId), eq(projects.workspaceId, request.workspaceId!))).limit(1);
    if (!project) return reply.code(404).send({ error: "Project not found" });

    const [task] = await db.insert(tasks).values({
      ...parsed.data,
      workspaceId: request.workspaceId!,
      createdBy: request.user!.id,
      externalRef: newExternalRef(),
    }).returning();

    if (task?.assigneeId) {
      await createNotification({
        workspaceId: request.workspaceId!, recipientId: task.assigneeId, type: "task_assigned",
        title: `You were assigned "${task.title}"`, taskId: task.id, projectId: task.projectId,
        actorId: request.user!.id, actorName: request.user!.email ?? "Someone",
      });
    }

    return reply.code(201).send({ task });
  });

  fastify.get<{ Params: { id: string } }>("/api/tasks/:id", async (request, reply) => {
    const [task] = await db.select().from(tasks)
      .where(and(eq(tasks.id, request.params.id), eq(tasks.workspaceId, request.workspaceId!))).limit(1);
    if (!task) return reply.code(404).send({ error: "Task not found" });

    const [taskSubtasks, comments, blocks, blockedBy] = await Promise.all([
      db.select().from(subtasks).where(eq(subtasks.taskId, task.id)),
      db.select().from(taskComments).where(eq(taskComments.taskId, task.id)),
      db.select().from(taskDependencies).where(eq(taskDependencies.blockerId, task.id)),
      db.select().from(taskDependencies).where(eq(taskDependencies.blockeeId, task.id)),
    ]);

    return reply.send({ task, subtasks: taskSubtasks, comments, blocks, blockedBy });
  });

  fastify.patch<{ Params: { id: string } }>("/api/tasks/:id", async (request, reply) => {
    const parsed = updateTaskSchema.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });

    const [existing] = await db.select().from(tasks)
      .where(and(eq(tasks.id, request.params.id), eq(tasks.workspaceId, request.workspaceId!))).limit(1);
    if (!existing) return reply.code(404).send({ error: "Task not found" });

    const [task] = await db.update(tasks).set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(tasks.id, request.params.id)).returning();

    if (parsed.data.assigneeId && parsed.data.assigneeId !== existing.assigneeId) {
      await createNotification({
        workspaceId: request.workspaceId!, recipientId: parsed.data.assigneeId, type: "task_assigned",
        title: `You were assigned "${task!.title}"`, taskId: task!.id, projectId: task!.projectId,
        actorId: request.user!.id, actorName: request.user!.email ?? "Someone",
      });
    }
    if (parsed.data.status === "Done" && existing.status !== "Done" && existing.assigneeId) {
      await createNotification({
        workspaceId: request.workspaceId!, recipientId: existing.assigneeId, type: "task_completed",
        title: `"${task!.title}" was marked done`, taskId: task!.id, projectId: task!.projectId,
        actorId: request.user!.id, actorName: request.user!.email ?? "Someone",
      });
    }

    return reply.send({ task });
  });

  fastify.delete<{ Params: { id: string } }>("/api/tasks/:id", async (request, reply) => {
    const result = await db.delete(tasks)
      .where(and(eq(tasks.id, request.params.id), eq(tasks.workspaceId, request.workspaceId!))).returning({ id: tasks.id });
    if (result.length === 0) return reply.code(404).send({ error: "Task not found" });
    return reply.code(204).send();
  });

  // ── Subtasks ─────────────────────────────────────────
  fastify.post<{ Params: { id: string } }>("/api/tasks/:id/subtasks", async (request, reply) => {
    const parsed = subtaskSchema.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });

    const [task] = await db.select({ id: tasks.id }).from(tasks)
      .where(and(eq(tasks.id, request.params.id), eq(tasks.workspaceId, request.workspaceId!))).limit(1);
    if (!task) return reply.code(404).send({ error: "Task not found" });

    const [subtask] = await db.insert(subtasks).values({ taskId: task.id, title: parsed.data.title }).returning();
    return reply.code(201).send({ subtask });
  });

  fastify.patch<{ Params: { id: string } }>("/api/subtasks/:id", async (request, reply) => {
    const parsed = z.object({ title: z.string().trim().min(1).max(200).optional(), done: z.boolean().optional() }).safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });

    // Scope through the parent task's workspace — subtasks has no workspaceId column of its own.
    const [subtask] = await db.select({ id: subtasks.id, taskId: subtasks.taskId }).from(subtasks)
      .innerJoin(tasks, eq(tasks.id, subtasks.taskId))
      .where(and(eq(subtasks.id, request.params.id), eq(tasks.workspaceId, request.workspaceId!))).limit(1);
    if (!subtask) return reply.code(404).send({ error: "Subtask not found" });

    const [updated] = await db.update(subtasks).set(parsed.data).where(eq(subtasks.id, request.params.id)).returning();
    return reply.send({ subtask: updated });
  });

  fastify.delete<{ Params: { id: string } }>("/api/subtasks/:id", async (request, reply) => {
    const [subtask] = await db.select({ id: subtasks.id }).from(subtasks)
      .innerJoin(tasks, eq(tasks.id, subtasks.taskId))
      .where(and(eq(subtasks.id, request.params.id), eq(tasks.workspaceId, request.workspaceId!))).limit(1);
    if (!subtask) return reply.code(404).send({ error: "Subtask not found" });

    await db.delete(subtasks).where(eq(subtasks.id, request.params.id));
    return reply.code(204).send();
  });

  // ── Comments ─────────────────────────────────────────
  fastify.post<{ Params: { id: string } }>("/api/tasks/:id/comments", async (request, reply) => {
    const parsed = commentSchema.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });

    const [task] = await db.select().from(tasks)
      .where(and(eq(tasks.id, request.params.id), eq(tasks.workspaceId, request.workspaceId!))).limit(1);
    if (!task) return reply.code(404).send({ error: "Task not found" });

    const authorName = request.user!.email?.split("@")[0] ?? "Someone";
    const [comment] = await db.insert(taskComments).values({
      taskId: task.id, authorId: request.user!.id, authorName,
      authorInitials: authorName.slice(0, 2).toUpperCase(), body: parsed.data.body,
    }).returning();

    // @mention detection — matches "@name" tokens against workspace member
    // names is done client-side for autocomplete; here we just notify the
    // task's assignee about the new comment (mention-specific notifications
    // are created by the frontend passing mentionedMemberIds — Phase 5/7).
    if (task.assigneeId) {
      await createNotification({
        workspaceId: request.workspaceId!, recipientId: task.assigneeId, type: "comment_added",
        title: `${authorName} commented on "${task.title}"`, body: parsed.data.body.slice(0, 140),
        taskId: task.id, projectId: task.projectId, actorId: request.user!.id, actorName,
      });
    }

    return reply.code(201).send({ comment });
  });

  fastify.patch<{ Params: { id: string } }>("/api/comments/:id", async (request, reply) => {
    const parsed = z.object({ body: z.string().trim().min(1).max(5000) }).safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });

    const [comment] = await db.select().from(taskComments)
      .innerJoin(tasks, eq(tasks.id, taskComments.taskId))
      .where(and(eq(taskComments.id, request.params.id), eq(tasks.workspaceId, request.workspaceId!))).limit(1);
    if (!comment) return reply.code(404).send({ error: "Comment not found" });
    if (comment.task_comments.authorId !== request.user!.id) {
      return reply.code(403).send({ error: "You can only edit your own comments" });
    }

    const [updated] = await db.update(taskComments)
      .set({ body: parsed.data.body, editedAt: new Date() })
      .where(eq(taskComments.id, request.params.id)).returning();
    return reply.send({ comment: updated });
  });

  fastify.delete<{ Params: { id: string } }>("/api/comments/:id", async (request, reply) => {
    const [comment] = await db.select().from(taskComments)
      .innerJoin(tasks, eq(tasks.id, taskComments.taskId))
      .where(and(eq(taskComments.id, request.params.id), eq(tasks.workspaceId, request.workspaceId!))).limit(1);
    if (!comment) return reply.code(404).send({ error: "Comment not found" });
    if (comment.task_comments.authorId !== request.user!.id) {
      return reply.code(403).send({ error: "You can only delete your own comments" });
    }

    await db.delete(taskComments).where(eq(taskComments.id, request.params.id));
    return reply.code(204).send();
  });

  // ── Dependencies ─────────────────────────────────────
  fastify.post<{ Params: { id: string } }>("/api/tasks/:id/dependencies", async (request, reply) => {
    const parsed = dependencySchema.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });
    if (parsed.data.blockeeId === request.params.id) {
      return reply.code(400).send({ error: "A task cannot block itself" });
    }

    const [blocker] = await db.select({ id: tasks.id }).from(tasks)
      .where(and(eq(tasks.id, request.params.id), eq(tasks.workspaceId, request.workspaceId!))).limit(1);
    const [blockee] = await db.select({ id: tasks.id }).from(tasks)
      .where(and(eq(tasks.id, parsed.data.blockeeId), eq(tasks.workspaceId, request.workspaceId!))).limit(1);
    if (!blocker || !blockee) return reply.code(404).send({ error: "Task not found" });

    const [dependency] = await db.insert(taskDependencies)
      .values({ blockerId: blocker.id, blockeeId: blockee.id }).returning();
    return reply.code(201).send({ dependency });
  });

  fastify.delete<{ Params: { id: string } }>("/api/dependencies/:id", async (request, reply) => {
    const [dependency] = await db.select().from(taskDependencies)
      .innerJoin(tasks, eq(tasks.id, taskDependencies.blockerId))
      .where(and(eq(taskDependencies.id, request.params.id), eq(tasks.workspaceId, request.workspaceId!))).limit(1);
    if (!dependency) return reply.code(404).send({ error: "Dependency not found" });

    await db.delete(taskDependencies).where(eq(taskDependencies.id, request.params.id));
    return reply.code(204).send();
  });
};

export default taskRoutes;
