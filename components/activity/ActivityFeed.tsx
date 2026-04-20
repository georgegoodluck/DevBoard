import CardHeader from "../ui/CardHeader";
import ActivityItem from "@/components/activity/ActivityItem";
import { ActivityEvent } from "@/types/activity";

const events: ActivityEvent[] = [
  {
    id: "1",
    actor: "George E.",
    action: "merged PR",
    target: "#24 — feat: add Drizzle ORM schema",
    project: "TickrPay",
    time: "12 mins ago",
    type: "merge",
  },
  {
    id: "2",
    actor: "Tunde N.",
    action: "closed task",
    target: "DBD-039 — Set up Drizzle ORM schema",
    project: "DevBoard",
    time: "38 mins ago",
    type: "task",
  },
  {
    id: "3",
    actor: "Ada K.",
    action: "opened task",
    target: "DBD-040 — Design settings page layout",
    project: "DevBoard",
    time: "1 hr ago",
    type: "task",
  },
  {
    id: "4",
    actor: "Mide O.",
    action: "updated progress on",
    target: "fin·snap to 81%",
    project: "fin·snap",
    time: "2 hrs ago",
    type: "update",
  },
  {
    id: "5",
    actor: "George E.",
    action: "pushed 3 commits to",
    target: "feat/auth-middleware",
    project: "TickrPay",
    time: "3 hrs ago",
    type: "merge",
  },
  {
    id: "6",
    actor: "Tunde N.",
    action: "commented on",
    target: "DBD-038 — Fix mobile sidebar overflow",
    project: "DevBoard",
    time: "4 hrs ago",
    type: "comment",
  },
  {
    id: "7",
    actor: "CI/CD",
    action: "build failed on",
    target: "feat/realtime-updates",
    project: "Pulse",
    time: "5 hrs ago",
    type: "ci",
  },
  {
    id: "8",
    actor: "George E.",
    action: "deployed",
    target: "SubTrack to production",
    project: "SubTrack",
    time: "Yesterday · 11:42pm",
    type: "deploy",
  },
];

export default function ActivityFeed() {
  return (
    <div className="bg-(--bg) border border-(--border) rounded-(--radius) overflow-hidden">
      <CardHeader
        title="Activity Feed"
        dotColor="var(--accent)"
        right={
          <span className="font-mono text-[10px] text-(--text3)">
            Today &#x2022; {events.length} events
          </span>
        }
      />

      <div>
        {events.map((e) => (
          <ActivityItem key={e.id} event={e} />
        ))}
      </div>
    </div>
  );
}
