"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Task } from "@/types/task";

export function useTasks(projectId?: string) {
  return useQuery({
    queryKey: ["tasks", { projectId }],
    queryFn: () =>
      api.get<{ tasks: Task[] }>(
        `/api/tasks${projectId ? `?projectId=${projectId}` : ""}`,
      ),
    select: (data) => data.tasks,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<Task> & { title: string; projectId: string }) =>
      api.post<{ task: Task }>("/api/tasks", body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["kanban"] });
    },
  });
}

export function useUpdateTask(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<Task>) =>
      api.patch<{ task: Task }>(`/api/tasks/${id}`, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["kanban"] });
      queryClient.invalidateQueries({ queryKey: ["task", id] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/tasks/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["kanban"] });
    },
  });
}
