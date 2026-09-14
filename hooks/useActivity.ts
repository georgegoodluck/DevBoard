"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ActivityEvent } from "@/types/activity";

export function useActivity(limit = 50) {
  return useQuery({
    queryKey: ["activity", limit],
    queryFn: () =>
      api.get<{ activity: ActivityEvent[] }>(`/api/activity?limit=${limit}`),
    select: (data) => data.activity,
  });
}
