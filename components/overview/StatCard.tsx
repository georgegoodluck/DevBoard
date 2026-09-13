import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: "accent" | "green" | "amber" | "purple";
}

const TONE_CLASSES = {
  accent: "text-accent bg-[var(--accent-dim)]",
  green: "text-green bg-[var(--green-dim)]",
  amber: "text-amber bg-[var(--amber-dim)]",
  purple: "text-purple bg-[var(--purple-dim)]",
};

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "accent",
}: StatCardProps) {
  return (
    <div className="rounded-devboard border border-border bg-bg1 p-4">
      <div
        className={cn(
          "mb-3 flex h-8 w-8 items-center justify-center rounded-devboard",
          TONE_CLASSES[tone],
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-2xl font-semibold text-text">{value}</p>
      <p className="mt-1 text-xs text-text2">{label}</p>
    </div>
  );
}
