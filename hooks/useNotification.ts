"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  body: string | null;
  taskId: string | null;
  projectId: string | null;
  read: boolean;
  createdAt: string;
}

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () =>
      api.get<{ notifications: NotificationItem[] }>("/api/notifications"),
    select: (data) => data.notifications,
    refetchInterval: 30_000,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.patch(`/api/notifications/${id}/read`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.patch("/api/notifications/read-all"),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });
}
