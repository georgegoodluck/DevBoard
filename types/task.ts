export type TaskStatus = "Todo" | "In Progress" | "In Review" | "Done";
export type TaskPriority = "high" | "mid" | "low";

export interface Task {
  id: string;
  workspaceId: string;
  projectId: string;
  assigneeId: string | null;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  position: number;
  due: string | null;
  labels: string[];
  externalRef: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
