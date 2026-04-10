type Props = {
  title: string;
  dotColor: string;
  action?: { label: string; onClick?: () => void };
  right?: React.ReactNode;
};

export default function CardHeader({ title, dotColor, action, right }: Props) {
  return (
    <div className="flex items-center justify-between px-3.5 py-3 border-b border-(--border)">
      <div className="flex items-center gap-2 text-[13px] text-(--text2) font-mono tracking-[0.02em] uppercase font-semibold">
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ background: dotColor }}
        />
        {title}
      </div>
      {action && (
        <span
          onClick={action.onClick}
          className="font-mono text-[10px] cursor-pointer hover:opacity-70 transition-opacity"
          style={{ color: dotColor }}
        >
          {action.label}
        </span>
      )}
      {right && !action && right}
    </div>
  );
}
