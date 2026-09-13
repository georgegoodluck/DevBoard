"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { KanbanCard } from "./KanbanCard";
import { KanbanCardSkeleton } from "./KanbanCardSkeleton";
import { AddTaskButton } from "./AddTaskButton";
import { cn } from "@/lib/cn";
import type { Task, TaskStatus } from "@/types/task";
import type { WorkspaceMember } from "@/types/workspace";

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  members: WorkspaceMember[];
  projectId: string;
  isLoading: boolean;
  onCardClick: (taskId: string) => void;
}

export function KanbanColumn({
  status,
  tasks,
  members,
  projectId,
  isLoading,
  onCardClick,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: { type: "column", status },
  });

  return (
    <div className="flex w-72 shrink-0 flex-col gap-2">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-text2">
          {status}
        </h3>
        <span className="text-xs text-text3">{tasks.length}</span>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex min-h-[120px] flex-1 flex-col gap-2 rounded-devboard border border-transparent p-1 transition-colors",
          isOver && "border-accent bg-[var(--accent-dim)]",
        )}
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {isLoading
            ? Array.from({ length: 2 }).map((_, i) => (
                <KanbanCardSkeleton key={i} />
              ))
            : tasks.map((task) => (
                <KanbanCard
                  key={task.id}
                  task={task}
                  assignee={members.find((m) => m.id === task.assigneeId)}
                  onClick={() => onCardClick(task.id)}
                />
              ))}
        </SortableContext>
        <AddTaskButton projectId={projectId} status={status} />
      </div>
    </div>
  );
}
