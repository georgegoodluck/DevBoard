import { LucideIcon } from "lucide-react";

type Props = {
  label: string;
  value: string;
  delta: string;
  deltaType: "up" | "down" | "neutral";
  icon: LucideIcon;
};

export default function StatCard({
  label,
  value,
  delta,
  deltaType,
  icon: Icon,
}: Props) {
  const deltaColor =
    deltaType === "up"
      ? "text-[var(--green)]"
      : deltaType === "down"
        ? "text-[var(--red)]"
        : "text-[var(--text3)]";
  return (
    <div className="border rounded-[var(--radius)] p-[14px] border-[var(--border)] bg-[var(--bg1)]">
      {/* Label */}
      <div className="flex gap-2 items-center text-mono uppercase text-[12px] text-[var(--text3)] mb-2">
        <Icon size={14} />
        {label}
      </div>
      {/* Value */}
      <div className="flex gap-2 text-[var(--text1)] font-mono text-[24px] font-semibold tracking-tight leading-none">
        {value}
      </div>
      {/* Delta */}
      <div className={`mt-[6px] text-[12px] font-medium ${deltaColor}`}>
        {delta} <span className="text-[var(--text3)]"> vs last week</span>
      </div>
    </div>
  );
}
