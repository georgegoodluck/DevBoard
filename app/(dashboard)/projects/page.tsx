"use client";

import { useState } from "react";
import {
  ProjectsHeader,
  type ProjectTab,
} from "@/components/projects/ProjectsHeader";
import { ProjectsGrid } from "@/components/projects/ProjectsGrid";
import { NewProjectModal } from "@/components/projects/NewProjectModal";
import { useProjects } from "@/hooks/useProjects";

export default function ProjectsPage() {
  const { data: projects, isLoading } = useProjects();
  const [tab, setTab] = useState<ProjectTab>("all");
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = (projects ?? []).filter((p) => {
    if (tab === "active") return p.status !== "Archived";
    if (tab === "archived") return p.status === "Archived";
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      <ProjectsHeader
        activeTab={tab}
        onTabChange={setTab}
        onNewProject={() => setModalOpen(true)}
      />
      {!isLoading && <ProjectsGrid projects={filtered} />}
      <NewProjectModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
