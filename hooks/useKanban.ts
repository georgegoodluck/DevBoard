import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { KanbanColumns, KanbanStatus } from "@/types/kanban";
import fetcher from "@/lib/api";

export function useKanban(projectId: string) {
  return useQuery<KanbanColumns>({
    queryKey: ["kanban", projectId],
    queryFn: () => fetcher(`/api/projects/${projectId}/kanban`),
    enabled: !!projectId,
  });
}

export function useMoveTask(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      status,
      position,
    }: {
      taskId: string;
      status: KanbanStatus;
      position: number;
    }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${taskId}/move`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status, position }),
        },
      );
      if (!res.ok) throw new Error("Failed to move task");
      return res.json();
    },

    // Optimistic update — move the card immediately, sync with server after
    onMutate: async ({ taskId, status, position }) => {
      await queryClient.cancelQueries({ queryKey: ["kanban", projectId] });
      const previous = queryClient.getQueryData<KanbanColumns>([
        "kanban",
        projectId,
      ]);

      queryClient.setQueryData<KanbanColumns>(["kanban", projectId], (old) => {
        if (!old) return old;
        const next = { ...old };

        // Find and remove from current column
        let movedTask = null;
        for (const col of Object.keys(next) as KanbanStatus[]) {
          const idx = next[col].findIndex((t) => t.id === taskId);
          if (idx !== -1) {
            [movedTask] = next[col].splice(idx, 1);
            next[col] = [...next[col]];
            break;
          }
        }

        // Insert into new column at new position
        if (movedTask) {
          movedTask = { ...movedTask, status, position };
          next[status] = [...next[status]];
          next[status].splice(position, 0, movedTask);
        }

        return next;
      });

      return { previous };
    },

    // Roll back on error
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["kanban", projectId], context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["kanban", projectId] });
    },
  });
}
