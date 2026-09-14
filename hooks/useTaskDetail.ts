"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { TaskDetail } from "@/types/task-detail";
import type { Task } from "@/types/task";

export function useTaskDetail(taskId: string | null) {
  return useQuery({
    queryKey: ["task", taskId],
    queryFn: () => api.get<TaskDetail>(`/api/tasks/${taskId}`),
    enabled: !!taskId,
  });
}

export function useUpdateTaskDetail(taskId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<Task>) =>
      api.patch<{ task: Task }>(`/api/tasks/${taskId}`, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["kanban"] });
    },
  });
}

export function useAddSubtask(taskId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (title: string) =>
      api.post(`/api/tasks/${taskId}/subtasks`, { title }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["task", taskId] }),
  });
}

export function useToggleSubtask(taskId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, done }: { id: string; done: boolean }) =>
      api.patch(`/api/subtasks/${id}`, { done }),
    onMutate: async ({ id, done }) => {
      await queryClient.cancelQueries({ queryKey: ["task", taskId] });
      const previous = queryClient.getQueryData<TaskDetail>(["task", taskId]);
      queryClient.setQueryData<TaskDetail>(["task", taskId], (old) =>
        old
          ? {
              ...old,
              subtasks: old.subtasks.map((s) =>
                s.id === id ? { ...s, done } : s,
              ),
            }
          : old,
      );
      return { previous };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.previous)
        queryClient.setQueryData(["task", taskId], ctx.previous);
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["task", taskId] }),
  });
}

export function useDeleteSubtask(taskId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/subtasks/${id}`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["task", taskId] }),
  });
}

export function useAddComment(taskId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: string) =>
      api.post(`/api/tasks/${taskId}/comments`, { body }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["task", taskId] }),
  });
}

export function useDeleteComment(taskId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/comments/${id}`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["task", taskId] }),
  });
}

export function useAddDependency(taskId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (blockeeId: string) =>
      api.post(`/api/tasks/${taskId}/dependencies`, { blockeeId }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["task", taskId] }),
  });
}

export function useRemoveDependency(taskId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/dependencies/${id}`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["task", taskId] }),
  });
}
