"use client";

import CardHeader from "@/components/ui/CardHeader";
import Badge from "@/components/ui/Badge";
import { BadgeVariant } from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import { useTasks } from "@/hooks/useTasks";
import { TaskStatus } from "@/types/tasks";

// Map normalized lowercase strings to CSS variables
const priorityColors: Record<string, string> = {
  low: "var(--green)",
  medium: "var(--amber)",
  high: "var(--danger)",
};

const statusToStyle: Record<TaskStatus, BadgeVariant> = {
  "In Progress": "amber",
  Todo: "blue",
  Done: "green",
  Review: "purple",
};

export default function RecentTasks() {
  const { data: tasks, isLoading, isError } = useTasks();

  return (
    <div className="bg-(--bg1) border border-(--border) rounded-md overflow-hidden">
      <CardHeader
        title="Recent Tasks"
        dotColor="var(--green)"
        action={{ label: "View all →" }}
      />
      <div>
        {isLoading && (
          <div className="px-3.5 py-8 text-center font-mono text-[11px] text-(--text3)">
            Loading...
          </div>
        )}
        {isError && (
          <div className="px-3.5 py-8 text-center font-mono text-[11px] text-(--danger)">
            Failed to load tasks.
          </div>
        )}
        {!isLoading && !isError && tasks?.length === 0 && (
          <div className="px-3.5 py-8 text-center font-mono text-[11px] text-(--text3)">
            No tasks found.
          </div>
        )}
        {tasks?.map((task) => {
          // Normalize priority key so 'High', 'high', 'HIGH' all work
          const priorityKey = String(task.priority || "low").toLowerCase();
          const dotColor = priorityColors[priorityKey] || "var(--green)";

          return (
            <div
              key={task.id}
              className="flex items-center gap-2.5 px-3.5 py-2 border-b border-(--border) last:border-none hover:bg-(--bg2) cursor-pointer transition-colors"
            >
              <span
                className="inline-block w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: dotColor }}
              />
              <span className="font-mono text-[10px] text-(--text3) w-13 shrink-0">
                {task.id}
              </span>
              <span className="flex-1 text-[12.5px] text-(--text) truncate min-w-0">
                {task.title}
              </span>
              <Badge label={task.status} variant={statusToStyle[task.status]} />
              <Avatar
                initials={task.assignee.initials}
                gradient={task.assignee.gradient}
                size={22}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
