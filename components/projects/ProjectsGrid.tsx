import ProjectsCard, { Project } from "./ProjectsCard";
import EmptyState from "@/components/ui/EmptyState";
import { FolderKanban } from "lucide-react";

const projects: Project[] = [
  {
    name: "TickrPay",
    description: "Event payment registration & ID-issuing platform",
    emoji: "🎟️",
    status: "In Progress",
    statusVariant: "amber",
    progress: 62,
    progressColor: "var(--amber)",
    tags: ["Next.js", "Supabase"],
    members: [
      { initials: "GG", gradient: "linear-gradient(135deg,#8b5cf6,#06b6d4)" },
      { initials: "TN", gradient: "linear-gradient(135deg,#2dd4a0,#4f8eff)" },
    ],
    taskCount: 18,
    due: "Apr 12",
  },
  {
    name: "Pulse",
    description: "Developer activity dashboard with terminal aesthetic",
    emoji: "⚡",
    status: "Planning",
    statusVariant: "blue",
    progress: 24,
    progressColor: "var(--accent)",
    tags: ["Next.js", "GraphQL"],
    members: [
      { initials: "GG", gradient: "linear-gradient(135deg,#8b5cf6,#06b6d4)" },
      { initials: "AK", gradient: "linear-gradient(135deg,#f59e0b,#f87171)" },
    ],
    taskCount: 32,
    due: "May 01",
  },
  {
    name: "fin·snap",
    description: "Personal finance tracker with analytics",
    emoji: "💸",
    status: "Review",
    statusVariant: "purple",
    progress: 81,
    progressColor: "var(--purple)",
    tags: ["Next.js", "Drizzle"],
    members: [
      { initials: "GG", gradient: "linear-gradient(135deg,#8b5cf6,#06b6d4)" },
      { initials: "MO", gradient: "linear-gradient(135deg,#a78bfa,#f87171)" },
    ],
    taskCount: 11,
    due: "Mar 28",
  },
  {
    name: "SubTrack",
    description: "Subscription tracker SaaS with AI advisor",
    emoji: "📊",
    status: "Active",
    statusVariant: "green",
    progress: 95,
    progressColor: "var(--green)",
    tags: ["React", "Tailwind"],
    members: [
      { initials: "GG", gradient: "linear-gradient(135deg,#8b5cf6,#06b6d4)" },
    ],
    taskCount: 4,
    due: "Mar 22",
  },
  {
    name: "DevBoard",
    description: "This project — fullstack dev collaboration dashboard",
    emoji: "🧩",
    status: "Planning",
    statusVariant: "blue",
    progress: 18,
    progressColor: "var(--accent)",
    tags: ["Next.js", "Fastify"],
    members: [
      { initials: "GG", gradient: "linear-gradient(135deg,#8b5cf6,#06b6d4)" },
      { initials: "AK", gradient: "linear-gradient(135deg,#f59e0b,#f87171)" },
      { initials: "TN", gradient: "linear-gradient(135deg,#2dd4a0,#4f8eff)" },
      { initials: "MO", gradient: "linear-gradient(135deg,#a78bfa,#f87171)" },
    ],
    taskCount: 52,
    due: "Ongoing",
  },
];

type Props = { filter: "all" | "active" | "archived" };

export default function ProjectsGrid({ filter }: Props) {
  const filtered =
    filter === "active"
      ? projects.filter((p) => p.status !== "Planning")
      : filter === "archived"
        ? []
        : projects;

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
    <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-2.5">
      {filtered.map((p) => (
        <ProjectsCard key={p.name} project={p} />
      ))}

      {/* New project placeholder */}
      <div className="bg-(--bg1) border border-dashed border-(--border2) rounded-1.5 p-3.5 cursor-pointer flex flex-col items-center justify-center gap-2 min-h-40 transition-colors hover:border-(--accent)">
        <div className="w-8 h-8 rounded-1.5 border border-dashed border-(--border2) flex items-center justify-center text-(--text3) text-[18px]">
          +
        </div>
        <span className="font-mono text-[11px] text-(--text3)">
          New project
        </span>
      </div>
    </div>
  );
}
