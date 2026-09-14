"use client";

import { Plus } from "lucide-react";
import { cn } from "@/lib/cn";

export type ProjectTab = "all" | "active" | "archived";

const TABS: { id: ProjectTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "archived", label: "Archived" },
];

interface ProjectsHeaderProps {
  activeTab: ProjectTab;
  onTabChange: (tab: ProjectTab) => void;
  onNewProject: () => void;
}

export function ProjectsHeader({
  activeTab,
  onTabChange,
  onNewProject,
}: ProjectsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-1 rounded-devboard border border-border bg-bg1 p-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "rounded-devboard px-3 py-1.5 text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "bg-[var(--accent-dim)] text-accent"
                : "text-text2 hover:text-text",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <button
        onClick={onNewProject}
        className="flex items-center gap-1.5 rounded-devboard px-3 py-1.5 text-sm font-medium text-white brand-gradient"
      >
        <Plus className="h-3.5 w-3.5" />
        New project
      </button>
    </div>
  );
}
