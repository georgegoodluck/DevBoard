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
    mutationFn: async({
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
    }),
  });
}
