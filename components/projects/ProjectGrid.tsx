"use client";

import { ProjectCard } from "./ProjectCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { useWorkspace } from "@/hooks/useWorkspace";
import type { Project } from "@/types/project";
import { FolderKanban } from "lucide-react";

export function ProjectsGrid({ projects }: { projects: Project[] }) {
  const { members } = useWorkspace();

  if (projects.length === 0) {
    return (
      <EmptyState
        icon={FolderKanban}
        title="No projects here"
        description="Try a different filter, or create a new project."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} members={members} />
      ))}
    </div>
  );
}
