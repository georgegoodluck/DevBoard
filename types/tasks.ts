// types/tasks.ts
export type TaskStatus = "Todo" | "In Progress" | "Review" | "Done";
export type TaskPriority = "High" | "Medium" | "Low";

export type Task = {
  id: string;
  title: string;
  description?: string; // ✅ Add this field (optional)
  status: TaskStatus;
  priority: TaskPriority;
  projectId: string;
  assignee: { initials: string; gradient: string };
  createdAt: string;
};
