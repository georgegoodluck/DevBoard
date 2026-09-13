import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { eq, and, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import {
  projects,
  projectMembers,
  tasks,
  projectStatusEnum,
} from "../db/schema.js";
import { requireWorkspace } from "../lib/workspace.js";

const createProjectSchema = z.object({
  name: z.string().trim().min(1).max(100),
  description: z.string().trim().max(2000).optional(),
  emoji: z.string().max(8).optional(),
  status: z.enum(projectStatusEnum.enumValues).optional(),
  due: z.coerce.date().optional(),
  tags: z.array(z.string().trim().max(30)).max(10).optional(),
  memberIds: z.array(z.string().uuid()).optional(),
});
const updateProjectSchema = createProjectSchema
  .partial()
  .extend({ progress: z.number().int().min(0).max(100).optional() });

async function replaceProjectMembers(projectId: string, memberIds: string[]) {
  await db
    .delete(projectMembers)
    .where(eq(projectMembers.projectId, projectId));
  if (memberIds.length > 0)
    await db
      .insert(projectMembers)
      .values(memberIds.map((memberId) => ({ projectId, memberId })));
}

const projectRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("preHandler", fastify.authenticate);
  fastify.addHook("preHandler", requireWorkspace);

  fastify.get("/api/projects", async (request, reply) => {
    const rows = await db
      .select({
        project: projects,
        taskCount: sql<number>`count(distinct ${tasks.id})::int`,
      })
      .from(projects)
      .leftJoin(tasks, eq(tasks.projectId, projects.id))
      .where(eq(projects.workspaceId, request.workspaceId!))
      .groupBy(projects.id);

    // Member IDs per project — fetched separately and grouped in memory
    // rather than joined into the query above, since joining project_members
    // alongside the task count join would multiply rows and break the count.
    const allMembers = await db
      .select({
        projectId: projectMembers.projectId,
        memberId: projectMembers.memberId,
      })
      .from(projectMembers)
      .where(
        sql`${projectMembers.projectId} IN (${sql.join(
          rows.map((r) => sql`${r.project.id}`),
          sql`, `,
        )})`,
      );

    const membersByProject = new Map<string, string[]>();
    for (const m of allMembers) {
      const list = membersByProject.get(m.projectId) ?? [];
      list.push(m.memberId);
      membersByProject.set(m.projectId, list);
    }

    return reply.send({
      projects: rows.map((r) => ({
        ...r.project,
        taskCount: r.taskCount,
        memberIds: membersByProject.get(r.project.id) ?? [],
      })),
    });
  });

  fastify.post("/api/projects", async (request, reply) => {
    const parsed = createProjectSchema.safeParse(request.body);
    if (!parsed.success)
      return reply.code(400).send({ error: parsed.error.flatten() });
    const { memberIds, ...values } = parsed.data;

    const [project] = await db
      .insert(projects)
      .values({
        ...values,
        workspaceId: request.workspaceId!,
        createdBy: request.user!.id,
      })
      .returning();
    if (!project)
      return reply.code(500).send({ error: "Failed to create project" });
    if (memberIds?.length) await replaceProjectMembers(project.id, memberIds);

    return reply.code(201).send({ project });
  });

  fastify.get<{ Params: { id: string } }>(
    "/api/projects/:id",
    async (request, reply) => {
      const [project] = await db
        .select()
        .from(projects)
        .where(
          and(
            eq(projects.id, request.params.id),
            eq(projects.workspaceId, request.workspaceId!),
          ),
        )
        .limit(1);
      if (!project) return reply.code(404).send({ error: "Project not found" });

      const members = await db
        .select({ memberId: projectMembers.memberId })
        .from(projectMembers)
        .where(eq(projectMembers.projectId, project.id));
      const [{ taskCount }] = await db
        .select({ taskCount: sql<number>`count(*)::int` })
        .from(tasks)
        .where(eq(tasks.projectId, project.id));

      return reply.send({
        project,
        memberIds: members.map((m) => m.memberId),
        taskCount,
      });
    },
  );

  fastify.patch<{ Params: { id: string } }>(
    "/api/projects/:id",
    async (request, reply) => {
      const parsed = updateProjectSchema.safeParse(request.body);
      if (!parsed.success)
        return reply.code(400).send({ error: parsed.error.flatten() });
      const { memberIds, ...values } = parsed.data;

      const [existing] = await db
        .select({ id: projects.id })
        .from(projects)
        .where(
          and(
            eq(projects.id, request.params.id),
            eq(projects.workspaceId, request.workspaceId!),
          ),
        )
        .limit(1);
      if (!existing)
        return reply.code(404).send({ error: "Project not found" });

      const [project] = Object.keys(values).length
        ? await db
            .update(projects)
            .set({ ...values, updatedAt: new Date() })
            .where(eq(projects.id, request.params.id))
            .returning()
        : await db
            .select()
            .from(projects)
            .where(eq(projects.id, request.params.id));

      if (memberIds) await replaceProjectMembers(request.params.id, memberIds);
      return reply.send({ project });
    },
  );

  fastify.delete<{ Params: { id: string } }>(
    "/api/projects/:id",
    async (request, reply) => {
      const result = await db
        .delete(projects)
        .where(
          and(
            eq(projects.id, request.params.id),
            eq(projects.workspaceId, request.workspaceId!),
          ),
        )
        .returning({ id: projects.id });
      if (result.length === 0)
        return reply.code(404).send({ error: "Project not found" });
      return reply.code(204).send();
    },
  );
};

export default projectRoutes;
