import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import BadgeVariant from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";

export type Projects = {
  name: string;
  description: string;
  emoji: string;
  progress: number;
  progressColor: string;
  status: string;
  statusVariant: BadgeVariant;
  tags: string;
  members: { initials: string; gradient: string }[];
  taskCount: number;
  due: string;
};

export default function ProjectCard() {
  return (
    <div>
      <h1>Project Card</h1>
    </div>
  );
}
