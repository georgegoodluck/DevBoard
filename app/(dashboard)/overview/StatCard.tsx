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
    <div>
      {/* Label */}
      <div>
        <Icon />
        {label}
      </div>
      {/* Value */}
      <div>{value}</div>
      {/* Delta */}
      <div className={deltaColor}>{delta}</div>
    </div>
  );
}
