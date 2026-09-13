"use client";

import { useParams } from "next/navigation";
import { useProject } from "@/hooks/useProjects";

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useProject(id);

  if (isLoading) return <p className="text-sm text-text2">Loading…</p>;

  return (
    <div>
      <h1 className="text-lg font-semibold">
        {data?.project.emoji} {data?.project.name}
      </h1>
      <p className="mt-2 text-sm text-text2">
        Kanban board arrives in Phase 4 — this page just confirms the project
        loads correctly for now.
      </p>
    </div>
  );
}
