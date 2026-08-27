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

  app.get<{ Params: { projectId: string } }>(
    "/api/projects/:projectId/kanban",
    async (req, reply) => {
      const workspaceId = req.workspaceId;
      const { projectId } = req.params;
      //   Start a try block to catch errors and initiate db query
      try {
        const rows = await db
          .select({
            id: tasks.id,
            title: tasks.title,
            description: tasks.description,
            status: tasks.status,
            priority: tasks.priority,
            position: tasks.position,
            due: tasks.due,
            labels: tasks.labels,
            createdAt: tasks.createdAt,
            assignee: {
              id: workspaceMembers.id,
              name: workspaceMembers.name,
              initials: workspaceMembers.initials,
            },
          })
          .from(tasks)
          .leftJoin(workspaceMembers, eq(tasks.assigneeId, workspaceMembers.id))
          .where(
            and(
              eq(tasks.workspaceId, workspaceId),
              eq(tasks.projectId, projectId),
            ),
          )
          .orderBy(asc(tasks.position)); // Group by status
        const columns = {
          Todo: [] as typeof rows,
          "In Progress": [] as typeof rows,
          "In Review": [] as typeof rows,
          Done: [] as typeof rows,
        };

        for (const task of rows) {
          const col = task.status as keyof typeof columns;
          if (columns[col]) columns[col].push(task);
        }

        return reply.send(columns);
      } catch (err) {
        return reply.status(500).send({ error: "Failed to fetch kanban data" });
      }
    },
  );
  // PATCH /api/tasks/:id/move
  // Called when a card is dragged to a new column or position
  app.patch<{
    Params: { id: string };
    // Change 'string' to your specific enum values
    Body: {
      status: "Todo" | "In Progress" | "In Review" | "Done";
      position: number;
    };
  }>("/api/tasks/:id/move", async (req, reply) => {
    const workspaceId = req.workspaceId;
    const { id } = req.params;
    const { status, position } = req.body;

    try {
      const [updated] = await db
        .update(tasks)
        // Now this works perfectly without 'as any'
        .set({ status, position, updatedAt: new Date() })
        .where(and(eq(tasks.id, id), eq(tasks.workspaceId, workspaceId)))
        .returning();

      if (!updated) return reply.status(404).send({ error: "Task not found" });
      return reply.send(updated);
    } catch (err) {
      return reply.status(500).send({ error: "Failed to move task" });
    }
  });
}
