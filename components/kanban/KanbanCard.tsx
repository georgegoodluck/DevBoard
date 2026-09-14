"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AlertTriangle, ArrowDown, Minus, CalendarClock } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/cn";
import type { Task } from "@/types/task";
import type { WorkspaceMember } from "@/types/workspace";

const PRIORITY_ICON = { high: AlertTriangle, mid: Minus, low: ArrowDown };
const PRIORITY_COLOR = {
  high: "text-red",
  mid: "text-amber",
  low: "text-text3",
};

interface KanbanCardProps {
  task: Task;
  assignee?: WorkspaceMember;
  onClick: () => void;
}

export function KanbanCard({ task, assignee, onClick }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: "task", task },
  });

  const style = { transform: CSS.Transform.toString(transform), transition };
  const PriorityIcon = PRIORITY_ICON[task.priority];

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={cn(
        "flex cursor-pointer flex-col gap-2 rounded-devboard border border-border bg-bg1 p-3 text-sm shadow-sm hover:border-border2",
        isDragging && "opacity-40",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-mono text-[10px] text-text3">
          {task.externalRef}
        </span>
        <PriorityIcon
          className={cn("h-3.5 w-3.5 shrink-0", PRIORITY_COLOR[task.priority])}
        />
      </div>

      <p className="text-text">{task.title}</p>

      {task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {task.labels.map((label) => (
            <span
              key={label}
              className="rounded-devboard bg-bg3 px-1.5 py-0.5 text-[10px] text-text2"
            >
              {label}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        {task.due ? (
          <span className="flex items-center gap-1 text-[10px] text-text3">
            <CalendarClock className="h-3 w-3" />
            {new Date(task.due).toLocaleDateString()}
          </span>
        ) : (
          <span />
        )}
        {assignee && (
          <Avatar name={assignee.name} initials={assignee.initials} size="sm" />
        )}
      </div>
    </div>
  );
}
