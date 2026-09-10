import { cn } from "@/lib/cn";
import type { TaskStatus, TaskPriority } from "@/types/task";
import type { ProjectStatus } from "@/types/project";

type BadgeTone = "neutral" | "green" | "amber" | "red" | "purple" | "accent";

const TONE_CLASSES: Record<BadgeTone, string> = {
  neutral: "bg-bg3 text-text2 border-border2",
  green: "bg-[var(--green-dim)] text-green border-transparent",
  amber: "bg-[var(--amber-dim)] text-amber border-transparent",
  red: "bg-[var(--red-dim)] text-red border-transparent",
  purple: "bg-[var(--purple-dim)] text-purple border-transparent",
  accent: "bg-[var(--accent-dim)] text-accent border-transparent",
};

const STATUS_TONE: Record<TaskStatus | ProjectStatus, BadgeTone> = {
  Todo: "neutral",
  "In Progress": "accent",
  "In Review": "amber",
  Done: "green",
  Planning: "neutral",
  Review: "amber",
  Active: "green",
  Archived: "neutral",
};

const PRIORITY_TONE: Record<TaskPriority, BadgeTone> = {
  high: "red",
  mid: "amber",
  low: "neutral",
};

interface BadgeProps {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
}

export function Badge({ children, tone = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-devboard border px-2 py-0.5 text-xs font-medium",
        TONE_CLASSES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({
  status,
}: {
  status: TaskStatus | ProjectStatus;
}) {
  return <Badge tone={STATUS_TONE[status]}>{status}</Badge>;
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return <Badge tone={PRIORITY_TONE[priority]}>{priority}</Badge>;
}
