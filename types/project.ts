export type ProjectStatus = "Planning" | "In Progress" | "Review" | "Active" | "Archived";

export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  description: string | null;
  emoji: string | null;
  status: ProjectStatus;
  progress: number;
  due: string | null;
  tags: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  taskCount?: number;
}
