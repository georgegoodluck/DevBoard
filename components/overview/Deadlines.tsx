"use client";

import { CardHeader } from "@/components/ui/CardHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { useTasks } from "@/hooks/useTasks";
import { CalendarClock } from "lucide-react";
import { cn } from "@/lib/cn";

function urgency(due: string): "red" | "amber" | "green" {
  const days = (new Date(due).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  if (days < 1) return "red";
  if (days < 4) return "amber";
  return "green";
}

const STRIP_CLASSES = {
  red: "border-l-red bg-[var(--red-dim)]",
  amber: "border-l-amber bg-[var(--amber-dim)]",
  green: "border-l-green bg-[var(--green-dim)]",
};

export function Deadlines() {
  const { data: tasks } = useTasks();

  const upcoming = (tasks ?? [])
    .filter((t) => t.due && t.status !== "Done")
    .sort((a, b) => new Date(a.due!).getTime() - new Date(b.due!).getTime())
    .slice(0, 6);

  return (
    <div className="rounded-devboard border border-border bg-bg1 p-4">
      <CardHeader title="Deadlines" />
      {upcoming.length === 0 ? (
        <EmptyState icon={CalendarClock} title="Nothing due soon" />
      ) : (
        <div className="flex flex-col gap-2">
          {upcoming.map((task) => (
            <div
              key={task.id}
              className={cn(
                "rounded-devboard border-l-2 px-3 py-2 text-xs",
                STRIP_CLASSES[urgency(task.due!)],
              )}
            >
              <p className="truncate text-text">{task.title}</p>
              <p className="mt-0.5 text-text3">
                {new Date(task.due!).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
