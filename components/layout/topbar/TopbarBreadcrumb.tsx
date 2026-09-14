"use client";

import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { useProject } from "@/hooks/useProjects";

const LABELS: Record<string, string> = {
  overview: "Overview",
  projects: "Projects",
  activity: "Activity",
  settings: "Settings",
};

export function TopbarBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const isProjectDetail = segments[0] === "projects" && segments.length > 1;

  const { data } = useProject(isProjectDetail ? segments[1]! : "");

  if (segments.length === 0) return null;

  const crumbs = isProjectDetail
    ? ["Projects", data?.project.name ?? "…", "board"]
    : segments.map((s) => LABELS[s] ?? s);

  return (
    <div className="flex items-center gap-1.5 text-sm text-text2">
      {crumbs.map((label, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight className="h-3 w-3 text-text3" />}
          <span className={i === crumbs.length - 1 ? "text-text" : ""}>
            {label}
          </span>
        </span>
      ))}
    </div>
  );
}
