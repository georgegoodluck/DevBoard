export type ProjectStatus = "In Progress" | "Planning" | "Review" | "Active";

export type Project = {
  id: string;
  name: string;
  description: string;
  emoji: string;
  status: ProjectStatus;
  progress: number;
  due: string;
  tags: string[];
  members: { initials: string; gradient: string }[];
  taskCount: number;
};
