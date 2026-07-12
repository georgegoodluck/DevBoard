import { Task } from "@/types/tasks";

export const mockTasks: Task[] = [
  {
    id: "DBD-041",
    title: "Implement Supabase auth middleware",
    status: "In Progress",
    priority: "High",
    projectId: "proj-5",
    assignee: {
      initials: "GE",
      gradient: "linear-gradient(135deg,#8b5cf6,#06b6d4)",
    },
    createdAt: "2024-04-01",
  },
  {
    id: "DBD-040",
    title: "Design settings page layout",
    status: "Todo",
    priority: "Medium",
    projectId: "proj-5",
    assignee: {
      initials: "AK",
      gradient: "linear-gradient(135deg,#f59e0b,#f87171)",
    },
    createdAt: "2024-04-01",
  },
  {
    id: "DBD-039",
    title: "Set up Drizzle ORM schema",
    status: "Done",
    priority: "Low",
    projectId: "proj-5",
    assignee: {
      initials: "TN",
      gradient: "linear-gradient(135deg,#2dd4a0,#4f8eff)",
    },
    createdAt: "2024-03-31",
  },
  {
    id: "DBD-038",
    title: "Fix mobile sidebar overflow",
    status: "Done",
    priority: "High",
    projectId: "proj-5",
    assignee: {
      initials: "MO",
      gradient: "linear-gradient(135deg,#a78bfa,#f87171)",
    },
    createdAt: "2024-03-30",
  },
  {
    id: "DBD-037",
    title: "Write Playwright E2E for auth flow",
    status: "Todo",
    priority: "Medium",
    projectId: "proj-5",
    assignee: {
      initials: "GE",
      gradient: "linear-gradient(135deg,#8b5cf6,#06b6d4)",
    },
    createdAt: "2024-03-30",
  },
];
