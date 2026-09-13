"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { KanbanColumns } from "@/types/kanban";
import type { TaskStatus } from "@/types/task";

export function useKanban(projectId: string) {
  return useQuery({
    queryKey: ["kanban", projectId],
    queryFn: () =>
      api.get<{ columns: KanbanColumns }>(`/api/projects/${projectId}/kanban`),
    select: (data) => data.columns,
    enabled: !!projectId,
  });
}

interface MoveParams {
  taskId: string;
  projectId: string;
  status: TaskStatus;
  position: number;
}

export function useMoveTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, status, position }: MoveParams) =>
      api.patch(`/api/tasks/${taskId}/move`, { status, position }),

    onMutate: async ({ taskId, projectId, status, position }) => {
      await queryClient.cancelQueries({ queryKey: ["kanban", projectId] });
      const previous = queryClient.getQueryData<KanbanColumns>([
        "kanban",
        projectId,
      ]);

      queryClient.setQueryData<KanbanColumns>(["kanban", projectId], (old) => {
        if (!old) return old;
        const next: KanbanColumns = {
          Todo: [...old.Todo],
          "In Progress": [...old["In Progress"]],
          "In Review": [...old["In Review"]],
          Done: [...old.Done],
        };
        let moved;
        for (const key of Object.keys(next) as TaskStatus[]) {
          const idx = next[key].findIndex((t) => t.id === taskId);
          if (idx !== -1) {
            [moved] = next[key].splice(idx, 1);
            break;
          }
        }
        if (moved) {
          next[status].push({ ...moved, status, position });
          next[status].sort((a, b) => a.position - b.position);
        }
        return next;
      });

      return { previous, projectId };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          ["kanban", context.projectId],
          context.previous,
        );
      }
    },

    onSettled: (_data, _err, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["kanban", projectId] });
    },
  });
}
