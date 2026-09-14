"use client";

import { CardHeader } from "@/components/ui/CardHeader";
import { StatusBadge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { useTasks } from "@/hooks/useTasks";
import { useWorkspace } from "@/hooks/useWorkspace";
import { ListTodo } from "lucide-react";
import { cn } from "@/lib/cn";

const PRIORITY_DOT = { high: "bg-red", mid: "bg-amber", low: "bg-text3" };

export function RecentTasks() {
  const { data: tasks, isLoading } = useTasks();
  const { members } = useWorkspace();

  const recent = [...(tasks ?? [])]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, 8);

  if (!isLoading && recent.length === 0) {
    return (
      <div className="rounded-devboard border border-border bg-bg1 p-4">
        <CardHeader title="Recent tasks" />
        <EmptyState
          icon={ListTodo}
          title="No tasks yet"
          description="Tasks you create will show up here."
        />
      </div>
    );
  }

  return (
    <div className="rounded-devboard border border-border bg-bg1 p-4">
      <CardHeader title="Recent tasks" />
      <div className="flex flex-col divide-y divide-border">
        {recent.map((task) => {
          const assignee = members.find((m) => m.id === task.assigneeId);
          return (
            <div
              key={task.id}
              className="flex items-center gap-3 py-2.5 text-sm"
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 shrink-0 rounded-full",
                  PRIORITY_DOT[task.priority],
                )}
              />
              <span className="w-16 shrink-0 font-mono text-xs text-text3">
                {task.externalRef}
              </span>
              <span className="flex-1 truncate text-text">{task.title}</span>
              <StatusBadge status={task.status} />
              {assignee ? (
                <Avatar
                  name={assignee.name}
                  initials={assignee.initials}
                  size="sm"
                />
              ) : (
                <div className="h-6 w-6 rounded-full border border-dashed border-border2" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
