import { LucideIcon } from "lucide-react";

type Props = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; onClick?: () => void };
};

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-9 h-9 rounded-lg bg-(--bg3) flex items-center justify-center mb-3">
        <Icon size={16} className="text-(--text3)" />
      </div>
      <div className="text-[13px] font-medium text-(--text) mb-1">{title}</div>
      <div className="text-[12px] text-(--text3) max-w-60 leading-relaxed">
        {description}
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 brand-gradient text-white font-mono text-[11px] px-3 py-1.5 rounded-(--radius) cursor-pointer transition-opacity hover:opacity-90"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
