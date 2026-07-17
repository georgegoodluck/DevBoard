import Avatar from "@/components/ui/Avatar";
import ProgressBar from "@/components/ui/ProgressBar";
import { Project } from "@/types/projects";
import Badge, { type BadgeVariant } from "@/components/ui/Badge";

// Map status to badge variant
const statusVariantMap: Record<string, BadgeVariant> = {
  "In Progress": "amber",
  "Planning": "blue",
  "Review": "purple",
  "Active": "green",
  "Done": "green",
};

// Map status to progress color
const statusColorMap: Record<string, string> = {
  "In Progress": "var(--amber)",
  "Planning": "var(--accent)",
  "Review": "var(--purple)",
  "Active": "var(--green)",
  "Done": "var(--green)",
};

export default function ProjectsCard({ project: p }: { project: Project }) {
  const badgeVariant = statusVariantMap[p.status] || "gray";
  // Get progress color from status
  const progressColor = statusColorMap[p.status] || "var(--accent)";

  return (
    <div className="bg-(--bg1) border border-(--border) rounded-1.5 p-3.5 cursor-pointer hover:border-(--border2) transition-colors flex flex-col gap-2.5">
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[13px] font-semibold text-(--text) mb-0.75">
            {p.name}
          </div>
          <div className="text-[11.5px] text-(--text3) leading-relaxed">
            {p.description}
          </div>
        </div>
        <div className="w-7.5 h-7.5 rounded-1.5 bg-(--bg3) flex items-center justify-center text-[14px] shrink-0">
          {p.emoji}
        </div>
      </div>

      {/* Progress - NOW USES mapped color */}
      <ProgressBar value={p.progress} color={progressColor} />

      {/* Tags */}
      <div className="flex flex-wrap gap-1.25">
        <Badge label={p.status} variant={badgeVariant} />
        {p.tags.map((tag) => (
          <Badge key={tag} label={tag} variant="gray" />
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2">
        <div className="flex">
          {p.members.map((m, i) => (
            <div key={m.initials} style={{ marginLeft: i === 0 ? 0 : -6 }}>
              <Avatar initials={m.initials} gradient={m.gradient} size={20} />
            </div>
          ))}
        </div>
        <span className="font-mono text-[10px] text-(--text3)ml-auto">
          {p.taskCount} tasks · {p.due}
        </span>
      </div>
    </div>
  );
}