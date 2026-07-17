import ProjectsCard from "./ProjectsCard";
import EmptyState from "@/components/ui/EmptyState";
import { FolderKanban } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";

type Props = { filter: "all" | "active" | "archived" };

export default function ProjectsGrid({ filter }: Props) {
  const { data: projects, isLoading, isError } = useProjects();

  if (isLoading)
    return (
      <div className="font-mono text-[11px] text-(--text3) py-8 text-center">
        Loading projects...
      </div>
    );

  if (isError)
    return (
      <div className="font-mono text-[11px]text-(--danger) py-8 text-center">
        Failed to load projects.
      </div>
    );

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
      {filtered.map((p) => (
        <ProjectsCard key={p.id} project={p} />
      ))}
      <div className="bg-(--bg1) border border-dashed border-(--border2) rounded-md p-3.5 cursor-pointer flex flex-col items-center justify-center gap-2 min-h-40 transition-colors hover:border-(--accent)">
        <div className="w-8 h-8 rounded-md border border-dashed border-(--border2) flex items-center justify-center text-(--text3) text-[18px]">
          +
        </div>
        <span className="font-mono text-[11px] text-(--text3)">
          New project
        </span>
      </div>
    </div>
  );
}
