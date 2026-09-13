"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Sprint } from "@/types/sprint";

export interface SprintTaskRow {
  id: string;
  taskId: string;
  storyPoints: number;
  title: string;
  status: string;
}

export function useSprints(projectId?: string) {
  return useQuery({
    queryKey: ["sprints", { projectId }],
    queryFn: () =>
      api.get<{ sprints: Sprint[] }>(
        `/api/sprints${projectId ? `?projectId=${projectId}` : ""}`,
      ),
    select: (data) => data.sprints,
  });
}

export function useSprintTasks(sprintId: string | null) {
  return useQuery({
    queryKey: ["sprint-tasks", sprintId],
    queryFn: () =>
      api.get<{ sprintTasks: SprintTaskRow[] }>(
        `/api/sprints/${sprintId}/tasks`,
      ),
    select: (data) => data.sprintTasks,
    enabled: !!sprintId,
  });
}

export function useCreateSprint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      projectId: string;
      name: string;
      goal?: string;
      startDate: string;
      endDate: string;
    }) => api.post<{ sprint: Sprint }>("/api/sprints", body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sprints"] }),
  });
}

export function useUpdateSprint(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<Sprint>) =>
      api.patch<{ sprint: Sprint }>(`/api/sprints/${id}`, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sprints"] }),
  });
}

export function useAddTaskToSprint(sprintId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { taskId: string; storyPoints?: number }) =>
      api.post(`/api/sprints/${sprintId}/tasks`, body),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["sprint-tasks", sprintId] }),
  });
}

export function useRemoveTaskFromSprint(sprintId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskId: string) =>
      api.delete(`/api/sprints/${sprintId}/tasks/${taskId}`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["sprint-tasks", sprintId] }),
  });
}
