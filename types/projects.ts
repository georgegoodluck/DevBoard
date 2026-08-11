export type ProjectStatus =
  "In Progress" | "Planning" | "Review" | "Active" | "Done";

export type Project = {
  id: string;
  name: string;
  description: string;
  emoji: string;
  status: ProjectStatus;
  // statusVariant (now calculated in component)
  progress: number;
  // progressColor (now calculated in component)
  due: string;
  tags: string[];
  members: { initials: string; gradient: string }[];
  taskCount: number;
};
