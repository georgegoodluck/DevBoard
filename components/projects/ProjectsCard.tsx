import Link from "next/link";
import { CalendarClock, ListTodo } from "lucide-react";
import { StatusBadge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { Project } from "@/types/project";
import type { WorkspaceMember } from "@/types/workspace";

interface ProjectCardProps {
  project: Project;
  members: WorkspaceMember[];
}

export function ProjectCard({ project, members }: ProjectCardProps) {
  const projectMembers = members.filter((m) =>
    project.memberIds?.includes(m.id),
  );

  return (
    <Link
      href={`/projects/${project.id}`}
      className="flex flex-col gap-3 rounded-devboard border border-border bg-bg1 p-4 transition-colors hover:border-border2 hover:bg-bg2"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="text-lg">{project.emoji ?? "📁"}</span>
          <h3 className="truncate text-sm font-semibold text-text">
            {project.name}
          </h3>
        </div>
        <StatusBadge status={project.status} />
      </div>

      {project.description && (
        <p className="line-clamp-2 text-xs text-text2">{project.description}</p>
      )}

      <ProgressBar value={project.progress} showLabel />

      {project.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-devboard bg-bg3 px-2 py-0.5 text-[10px] text-text2"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-1 flex items-center justify-between text-xs text-text3">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <ListTodo className="h-3.5 w-3.5" />
            {project.taskCount ?? 0}
          </span>
          {project.due && (
            <span className="flex items-center gap-1">
              <CalendarClock className="h-3.5 w-3.5" />
              {new Date(project.due).toLocaleDateString()}
            </span>
          )}
        </div>
        {projectMembers.length > 0 && (
          <div className="flex -space-x-2">
            {projectMembers.slice(0, 4).map((m) => (
              <Avatar
                key={m.id}
                name={m.name}
                initials={m.initials}
                size="sm"
                className="ring-2 ring-bg1"
              />
            ))}
            {projectMembers.length > 4 && (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-bg3 text-[10px] text-text2 ring-2 ring-bg1">
                +{projectMembers.length - 4}
              </div>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
