import { LucideIcon } from "lucide-react";

type Props = {
  label: string;
  value: string;
  delta: string;
  unit: string;
  subLabel: string;
  deltaType: "up" | "down" | "neutral";
  icon: LucideIcon;
};

export default function StatCard({
  label,
  value,
  delta,
  unit,
  subLabel,
  deltaType,
  icon: Icon,
}: Props) {
  const deltaColor =
    deltaType === "up"
      ? "text-(--green)"
      : deltaType === "down"
        ? "text-(--red)"
        : "text-(--text3)";
  // Arrow logic
  const arrow = deltaType === "up" ? "↑" : deltaType === "down" ? "↓" : "";

  return (
    <div className="border rounded-(--radius) p-3.5 border-(--border) bg-(--bg1)">
      {/* Label */}
      <div className="flex gap-2 items-center text-mono uppercase text-[12px] text-(--text3) mb-2">
        <Icon size={14} />
        {label}
      </div>
      {/* Value */}
      <div className="flex items-baseline text(--text) font-mono text-[24px] font-semibold tracking-tight leading-none">
        {value}
        {unit && (
          <span className="text-[14px] text-(--text3) font-normal">{unit}</span>
        )}
      </div>
      {/* Delta */}
      <div className={`mt-1.5 text-[12px] font-medium ${deltaColor}`}>
        {arrow} <span className="ml-1">{delta}</span>
        <span className="text-(--text3) ml-1"> vs {subLabel}</span>
      </div>
    </div>
  );
}
