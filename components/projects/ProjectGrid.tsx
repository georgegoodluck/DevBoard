import ProjectCard, { Projects } from "./ProjectCard";
import EmptyState from "../ui/EmptyState";
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
      { initials: "GE", gradient: "linear-gradient(135deg,#8b5cf6,#06b6d4)" },
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
      { initials: "GE", gradient: "linear-gradient(135deg,#8b5cf6,#06b6d4)" },
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
      { initials: "GE", gradient: "linear-gradient(135deg,#8b5cf6,#06b6d4)" },
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
      { initials: "GE", gradient: "linear-gradient(135deg,#8b5cf6,#06b6d4)" },
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
      { initials: "GE", gradient: "linear-gradient(135deg,#8b5cf6,#06b6d4)" },
      { initials: "AK", gradient: "linear-gradient(135deg,#f59e0b,#f87171)" },
      { initials: "TN", gradient: "linear-gradient(135deg,#2dd4a0,#4f8eff)" },
      { initials: "MO", gradient: "linear-gradient(135deg,#a78bfa,#f87171)" },
    ],
    taskCount: 52,
    due: "Ongoing",
  },
];

export default function ProjectGrid() {
  return (
    <div>
      <h1>Hello</h1>
    </div>
  );
}
