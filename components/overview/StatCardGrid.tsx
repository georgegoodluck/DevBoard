"use client";

import { ListTodo, Loader, TrendingUp, CheckCircle2 } from "lucide-react";
import { StatCard } from "./StatCard";
import { useTasks } from "@/hooks/useTasks";
import { useVelocity } from "@/hooks/useVelocity";

export function StatCardGrid() {
  const { data: tasks } = useTasks();
  const { average } = useVelocity();

  const active = (tasks ?? []).filter((t) => t.status !== "Done").length;
  const inProgress = (tasks ?? []).filter(
    (t) => t.status === "In Progress",
  ).length;
  const done = (tasks ?? []).filter((t) => t.status === "Done").length;
  const total = tasks?.length ?? 0;
  const completion = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <StatCard
        label="Active tasks"
        value={active}
        icon={ListTodo}
        tone="accent"
      />
      <StatCard
        label="In progress"
        value={inProgress}
        icon={Loader}
        tone="purple"
      />
      <StatCard
        label="Velocity"
        value={average}
        icon={TrendingUp}
        tone="green"
      />
      <StatCard
        label="Completion"
        value={`${completion}%`}
        icon={CheckCircle2}
        tone="amber"
      />
    </div>
  );
}
