import Avatar from "@/components/ui/Avatar";
import Badge, { type BadgeVariant } from "@/components/ui/Badge";
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

export default function ProjectCard({ projects: p }: { projects: Projects }) {
  return (
    <div>
      {/* Top Row */}
      <div>
        <div>
          <div>{p.name}</div>
          <div>{p.description}</div>
        </div>
        <div>{p.emoji}</div>
      </div>
      {/* Progress */}
      <ProgressBar value={p.progress} color={p.progressColor} />
      {/* Tags */}
      <div>
        <Badge label={p.status} variant={p.statusVariant} />
        {p.tags.map((tag) => (
          <Badge key={tag} label={tag} variant="red" />
        ))}
      </div>
      {/* Footer */}
      <div>
        {/* Stacked Avatars */}
        <div>
          {p.members.map((m, i) => (
            <div key={m.initials} style={{ marginLeft: 1 === 0 ? 0 : -6 }}>
              <Avatar initials={m.initials} gradient={m.gradient} size={20} />
            </div>
          ))}
        </div>
        <span>
          {p.taskCount} tasks &middot; {p.due}
        </span>
      </div>
    </div>
  );
}
