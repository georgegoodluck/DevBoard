"use client";

import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { LayoutGrid, List } from "lucide-react";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { TaskListView } from "@/components/kanban/TaskListView";
import { useProject } from "@/hooks/useProjects";
import { useTasks } from "@/hooks/useTasks";
import { cn } from "@/lib/cn";

type View = "board" | "list";

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [view, setView] = useState<View>("board");

  const { data: projectData, isLoading: projectLoading } = useProject(id);
  const { data: tasks } = useTasks(id);

  function openTask(taskId: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("task", taskId);
    router.push(`/projects/${id}?${params.toString()}`);
  }

  if (projectLoading) return <p className="text-sm text-text2">Loading…</p>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-lg font-semibold">
          <span>{projectData?.project.emoji}</span>
          {projectData?.project.name}
        </h1>

        <div className="flex gap-1 rounded-devboard border border-border bg-bg1 p-1">
          <button
            onClick={() => setView("board")}
            className={cn(
              "flex items-center gap-1.5 rounded-devboard px-2.5 py-1 text-xs",
              view === "board"
                ? "bg-[var(--accent-dim)] text-accent"
                : "text-text2",
            )}
          >
            <LayoutGrid className="h-3.5 w-3.5" /> Board
          </button>
          <button
            onClick={() => setView("list")}
            className={cn(
              "flex items-center gap-1.5 rounded-devboard px-2.5 py-1 text-xs",
              view === "list"
                ? "bg-[var(--accent-dim)] text-accent"
                : "text-text2",
            )}
          >
            <List className="h-3.5 w-3.5" /> List
          </button>
        </div>
      </div>

      {view === "board" ? (
        <KanbanBoard projectId={id} onCardClick={openTask} />
      ) : (
        <TaskListView tasks={tasks ?? []} onRowClick={openTask} />
      )}
    </div>
  );
}
