"use client";

import { useProjects } from "@/hooks/useProjects";
import ProjectCard from "./ProjectsCard";
import EmptyState from "@/components/ui/EmptyState";
import { FolderKanban } from "lucide-react";

type Props = { filter: "all" | "active" | "archived" };

export default function ProjectsGrid({ filter }: Props) {
  const { data: projects, isLoading, isError } = useProjects();

  if (isLoading) {
    return (
      <div className="font-mono text-[11px] text-[var(--text3)] py-[32px] text-center">
        Loading projects...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="font-mono text-[11px] text-[var(--danger)] py-[32px] text-center">
        Failed to load projects.
      </div>
    );
  }

  const filtered =
    filter === "active"
      ? projects?.filter((p) => p.status !== "Planning") || []
      : filter === "archived"
        ? []
        : projects || [];

  if (filtered.length === 0) {
    return (
      <EmptyState
        icon={FolderKanban}
        title="No projects here"
        description="Archived projects will appear here once you archive them."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[10px]">
      {filtered.map((p) => (
        <ProjectCard key={p.id} project={p} />
      ))}

      {/* New project placeholder */}
      <div className="bg-[var(--bg1)] border border-dashed border-[var(--border2)] rounded-[6px] p-[14px] cursor-pointer flex flex-col items-center justify-center gap-[8px] min-h-[160px] transition-colors hover:border-[var(--accent)]">
        <div className="w-[32px] h-[32px] rounded-[6px] border border-dashed border-[var(--border2)] flex items-center justify-center text-[var(--text3)] text-[18px]">
          +
        </div>
        <span className="font-mono text-[11px] text-[var(--text3)]">
          New project
        </span>
      </div>
    </div>
  );
}
