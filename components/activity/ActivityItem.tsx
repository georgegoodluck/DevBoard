import { ActivityEvent } from "@/types/activity";
import {
  GitMerge,
  SquareCheck,
  MessageSquare,
  Rocket,
  CircleAlert,
  RefreshCw,
} from "lucide-react";

const iconConfig = {
  merge: { icon: GitMerge, bg: "var(--green-dim)", color: "var(--green)" },
  task: { icon: SquareCheck, bg: "var(--accent-dim)", color: "var(--accent)" },
  comment: {
    icon: MessageSquare,
    bg: "var(--accent-dim)",
    color: "var(--accent)",
  },
  deploy: { icon: Rocket, bg: "var(--green-dim)", color: "var(--green)" },
  ci: { icon: CircleAlert, bg: "var(--danger-dim)", color: "var(--danger)" },
  update: { icon: RefreshCw, bg: "var(--amber-dim)", color: "var(--amber)" },
};

export default function ActivityItem({ event }: { event: ActivityEvent }) {
  // AcitvityItem recieves a prop called event which must be of type ActivityEvent
  const cfg = iconConfig[event.type];
  const Icon = cfg.icon;

  return (
    <div className="flex gap-2.5 px-3.5 py-2.5 border-b border-(--border) last:border-none hover:bg-(--bg2) transition-colors cursor-default">
      {/* Icon */}
      <div
        className="w-6.5 h-6.5 rounded-[5px] flex items-center justify-center shrink-0 mt-px"
        style={{ background: cfg.bg }}
      >
        <Icon size={12} style={{ color: cfg.color }} />
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">
        <div className="text-[12.5px] text-(--text) leading-normal">
          <span className="font-medium">{event.actor}</span>{" "}
          <span className="text-(--text2)">{event.action}</span>{" "}
          <span className="text-(--text2)">{event.target}</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] text-(--text3) mt-0.5">
          <span>{event.time}</span>
          <span className="text-(--text3) text-[14px] font-bold leading-none">
            &#x2022;
          </span>
          <span>{event.project}</span>
        </div>
      </div>
    </div>
  );
}
