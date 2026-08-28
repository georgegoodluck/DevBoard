import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { KanbanColumns, KanbanStatus } from "@/types/kanban";
import fetcher from "@/lib/api";

export function useKanban(projectId: string) {
    return useQuery<KanbanColumns>({
        queryKey: ["kanban", projectId],
        queryFn: () => fetcher(`/api/projects/${projectId}/kanban`),
        enabled: !!projectId,
    })
}