type Props = {
  value: number;
  color?: string;
};

export default function ProgressBar({ value, color = "var(--accent)" }: Props) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 bg-(--bg3) rounded-(--radius) overflow-hidden">
        <div
          className="rounded-(--radius) h-full transition-all"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
      <span className="text-(--text3) text-[10px]">{value}%</span>
    </div>
  );
}
