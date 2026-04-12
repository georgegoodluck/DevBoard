export type BadgeVariant = "green" | "amber" | "red" | "blue" | "purple";

type Props = {
  label: string;
  variant: BadgeVariant;
};

const variantStyles: Record<BadgeVariant, string> = {
  green: "bg-[var(--green-dim)] text-[var(--green)]",
  amber: "bg-[var(--amber-dim)] text-[var(--amber)]",
  red: "bg-[var(--red-dim)] text-[var(--red)]",
  blue: "bg-[var(--accent-dim)] text-[var(--accent)]",
  purple: "bg-[var(--purple-dim)] text-[var(--purple)]",
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
