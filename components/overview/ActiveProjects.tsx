"use client";

import Link from "next/link";
import { CardHeader } from "@/components/ui/CardHeader";
import { StatusBadge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { useProjects } from "@/hooks/useProjects";
import { FolderKanban } from "lucide-react";

export function ActiveProjects() {
  const { data: projects, isLoading } = useProjects();
  const active = (projects ?? []).filter(
    (p) => p.status === "Active" || p.status === "In Progress",
  );

  return (
    <div className="rounded-devboard border border-border bg-bg1 p-4">
      <CardHeader title="Active projects" />
      {!isLoading && active.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No active projects"
          description="Create a project to get started."
        />
      ) : (
        <div className="flex flex-col divide-y divide-border">
          {active.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="flex items-center gap-4 py-3 text-sm hover:bg-bg2"
            >
              <span className="text-base">{project.emoji ?? "📁"}</span>
              <span className="flex-1 truncate text-text">{project.name}</span>
              <StatusBadge status={project.status} />
              <ProgressBar value={project.progress} className="w-24" />
              {project.due && (
                <span className="w-20 shrink-0 text-right text-xs text-text3">
                  {new Date(project.due).toLocaleDateString()}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
