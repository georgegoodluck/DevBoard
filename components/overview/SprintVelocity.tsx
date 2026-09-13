"use client";

import { CardHeader } from "@/components/ui/CardHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { useVelocity } from "@/hooks/useVelocity";
import { TrendingUp } from "lucide-react";

export function SprintVelocity() {
  const { points, isLoading } = useVelocity();

  if (!isLoading && points.length === 0) {
    return (
      <div className="rounded-devboard border border-border bg-bg1 p-4">
        <CardHeader title="Sprint velocity" subtitle="Last 8 sprints" />
        <EmptyState
          icon={TrendingUp}
          title="No completed sprints yet"
          description="Velocity appears here once a sprint wraps up."
        />
      </div>
    );
  }

  const max = Math.max(1, ...points.map((p) => p.points));

  return (
    <div className="rounded-devboard border border-border bg-bg1 p-4">
      <CardHeader title="Sprint velocity" subtitle="Last 8 sprints" />
      <div className="flex h-32 items-end gap-2">
        {points.map((p) => (
          <div
            key={p.sprintName}
            className="flex flex-1 flex-col items-center gap-1.5"
          >
            <div
              className="w-full rounded-t-devboard brand-gradient transition-[height] duration-300"
              style={{
                height: `${(p.points / max) * 100}%`,
                minHeight: p.points > 0 ? "4px" : "0px",
              }}
              title={`${p.points} points`}
            />
            <span className="truncate text-[10px] text-text3">
              {p.sprintName}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
