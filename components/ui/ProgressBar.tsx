import { cn } from "@/lib/cn";

interface ProgressBarProps {
  value: number; // 0–100
  className?: string;
  showLabel?: boolean;
}

export function ProgressBar({ value, className, showLabel }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-bg3">
        <div
          className="h-full rounded-full brand-gradient transition-[width] duration-300"
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-text2 tabular-nums">{clamped}%</span>
      )}
    </div>
  );
}
