"use client";

import { useState } from "react";
import ProjectsGrid from "@/components/projects/ProjectsGrid";
import ProjectsHeader from "@/components/projects/ProjectsHeader";

type Tab = "all" | "active" | "archived";

export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("all");

  return (
    <div>
      <ProjectsHeader activeTab={activeTab} onTabChange={setActiveTab} />
      <ProjectsGrid filter={activeTab} />
    </div>
  );
}
