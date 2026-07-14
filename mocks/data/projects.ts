import { Project } from "@/types/projects";

export const mockProjects: Project[] = [
  {
    id: "proj-1",
    name: "TickrPay",
    description: "Event and ID-issuing platform",
    emoji: "🎟️",
    status: "In Progress",
    progress: 62,
    due: "Apr 12",
    tags: ["Next.js", "Supabase"],
    members: [
      {
        initials: "GG",
        gradient:
          "linear-gradient(90deg, rgba(2, 0, 36, 1) 0%, rgba(9, 9, 121, 1) 11%, rgba(0, 212, 255, 1) 100%)",
      },
      {
        initials: "TN",
        gradient:
          "radial-gradient(circle,rgba(238, 174, 202, 1) 0%, rgba(206, 179, 213, 1) 35%, rgba(148, 187, 233, 1) 100%)",
      },
    ],
    taskCount: 18,
  },
  {
    id: "proj-2",
    name: "Pulse",
    description: "Developer activity dashboard with terminal aesthetic",
    emoji: "⚡",
    status: "Planning",
    progress: 24,
    due: "May 01",
    tags: ["Next.js", "GraphQL"],
    members: [
      {
        initials: "GG",
        gradient:
          "linear-gradient(90deg, rgba(2, 0, 36, 1) 0%, rgba(9, 9, 121, 1) 11%, rgba(0, 212, 255, 1) 100%)",
      },
      { initials: "AK", gradient: "linear-gradient(135deg,#f59e0b,#f87171)" },
    ],
    taskCount: 18,
  },
  {
    id: "proj-3",
    name: "fin·snap",
    description: "Personal finance tracker with analytics",
    emoji: "💸",
    status: "Review",
    progress: 81,
    due: "Mar 28",
    tags: ["Next.js", "Drizzle"],
    members: [
      { initials: "GG", gradient: "linear-gradient(135deg,#8b5cf6,#06b6d4)" },
      { initials: "MO", gradient: "linear-gradient(135deg,#a78bfa,#f87171)" },
    ],
    taskCount: 11,
  },
  {
    id: "proj-4",
    name: "SubTrack",
    description: "Subscription tracker SaaS with AI advisor",
    emoji: "📊",
    status: "Active",
    progress: 95,
    due: "Mar 22",
    tags: ["React", "Tailwind"],
    members: [
      { initials: "GG", gradient: "linear-gradient(135deg,#8b5cf6,#06b6d4)" },
    ],
    taskCount: 4,
  },
  {
    id: "proj-5",
    name: "DevBoard",
    description: "This project — fullstack dev collaboration dashboard",
    emoji: "🧩",
    status: "Planning",
    progress: 18,
    due: "Ongoing",
    tags: ["Next.js", "Fastify"],
    members: [
      { initials: "GG", gradient: "linear-gradient(135deg,#8b5cf6,#06b6d4)" },
      { initials: "AK", gradient: "linear-gradient(135deg,#f59e0b,#f87171)" },
      { initials: "TN", gradient: "linear-gradient(135deg,#2dd4a0,#4f8eff)" },
      { initials: "MO", gradient: "linear-gradient(135deg,#a78bfa,#f87171)" },
    ],
    taskCount: 52,
  },
];
