import { cn } from "@/lib/cn";

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export function CardHeader({
  title,
  subtitle,
  action,
  className,
}: CardHeaderProps) {
  return (
    <div
      className={cn("flex items-start justify-between gap-4 pb-3", className)}
    >
      <div>
        <h3 className="text-sm font-semibold text-text">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-text2">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
