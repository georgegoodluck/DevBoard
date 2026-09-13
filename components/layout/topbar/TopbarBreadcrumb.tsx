"use client";

import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

const LABELS: Record<string, string> = {
  overview: "Overview",
  projects: "Projects",
  activity: "Activity",
  settings: "Settings",
};

export function TopbarBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <div className="flex items-center gap-1.5 text-sm text-text2">
      {segments.map((segment, i) => {
        const label = LABELS[segment] ?? segment;
        const isLast = i === segments.length - 1;
        return (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3 w-3 text-text3" />}
            <span className={isLast ? "text-text" : ""}>{label}</span>
          </span>
        );
      })}
    </div>
  );
}
