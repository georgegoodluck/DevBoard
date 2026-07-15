import { type BadgeVariant } from "@/components/ui/Badge";


export type ProjectStatus = "In Progress" | "Planning" | "Review" | "Active";

export type Project = {
  id: string;
  name: string;
  description: string;
  emoji: string;
  status: ProjectStatus;
  statusVariant: BadgeVariant;
  progress: number;
  progressColor: string;
  due: string;
  tags: string[];
  members: { initials: string; gradient: string }[];
  taskCount: number;
};
