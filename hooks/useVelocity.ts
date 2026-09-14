"use client";

import { useQueries, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Sprint } from "@/types/sprint";
import type { SprintTaskRow } from "./useSprints";

export function useVelocity() {
  const { data: sprintsData } = useQuery({
    queryKey: ["sprints", {}],
    queryFn: () => api.get<{ sprints: Sprint[] }>("/api/sprints"),
    select: (d) => d.sprints,
  });

  const completedSprints = (sprintsData ?? [])
    .filter((s) => s.status === "completed")
    .slice(-8);

  const results = useQueries({
    queries: completedSprints.map((sprint) => ({
      queryKey: ["sprint-tasks", sprint.id],
      queryFn: () =>
        api.get<{ sprintTasks: SprintTaskRow[] }>(
          `/api/sprints/${sprint.id}/tasks`,
        ),
      select: (d: { sprintTasks: SprintTaskRow[] }) =>
        d.sprintTasks
          .filter((t) => t.status === "Done")
          .reduce((sum, t) => sum + t.storyPoints, 0),
    })),
  });

  const points = results.map((r, i) => ({
    sprintName: completedSprints[i]!.name,
    points: r.data ?? 0,
  }));

  const isLoading = results.some((r) => r.isLoading);
  const average =
    points.length > 0
      ? Math.round(points.reduce((s, p) => s + p.points, 0) / points.length)
      : 0;

  return { points, average, isLoading };
}
