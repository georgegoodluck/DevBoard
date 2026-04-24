export type BadgeVariant = "green" | "amber" | "red" | "blue" | "purple" | "gray";

type Props = {
  label: string;
  variant: BadgeVariant;
};

const variantStyles: Record<BadgeVariant, string> = {
  green: "bg-(--green-dim) text-(--green)",
  amber: "bg-(--amber-dim) text-(--amber)",
  red: "bg-(--danger-dim) text-(--danger)",
  blue: "bg-(--accent-dim) text-(--accent)",
  purple: "bg-(--purple-dim) text-(--purple)",
  gray: "bg-(--gray) text-(--text2)"
};

export default function Badge({ label, variant }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1 font-mono text-[10px] font-medium px-1.75 py-0.5 rounded-[3px] whitespace-nowrap ${variantStyles[variant]}`}
    >
      <span className="w-1.25 h-1.25 rounded-full bg-current shrink-0" />
      {label}
    </span>
  );
}
