import CardHeader from "@/components/ui/CardHeader";

type Task = {
  id: string;
  name: string;
  status: "In Progress" | "Todo" | "Done";
  priority: "low" | "medium" | "high";
  assignee: string;
  assigneeColor: string;
};

const tasks: Task[] = [
  {
    id: "DBD-041",
    name: "Implement Supabase with auth middleware",
    status: "In Progress",
    priority: "high",
    assignee: "GG",
    assigneeColor:
      "linear-gradient(90deg, rgba(2, 0, 36, 1) 0%, rgba(9, 9, 121, 1) 11%, rgba(0, 212, 255, 1) 100%)",
  },
  {
    id: "DBD-040",
    name: "Design settings page layout",
    status: "Todo",
    priority: "medium",
    assignee: "JD",
    assigneeColor:
      "linear-gradient(0deg,rgba(34, 193, 195, 1) 0%, rgba(187, 189, 90, 1) 73%, rgba(253, 187, 45, 1) 100%)",
  },
  {
    id: "DBD-039",
    name: "Set up Drizzle ORM schema",
    status: "Done",
    priority: "low",
    assignee: "TM",
    assigneeColor:
      "radial-gradient(circle,rgba(238, 174, 202, 1) 0%, rgba(206, 179, 213, 1) 35%, rgba(148, 187, 233, 1) 100%)",
  },
  {
    id: "DBD-038",
    name: "Fix mobile sidebar overflow",
    status: "Done",
    priority: "low",
    assignee: "MO",
    assigneeColor:
      "radial-gradient(circle,rgba(238, 174, 202, 1) 0%, rgba(126, 30, 148, 1) 35%, rgba(148, 187, 233, 1) 100%)",
  },
  {
    id: "DBD-037",
    name: "Write Playwright E2E for auth flow",
    status: "Todo",
    priority: "medium",
    assignee: "GG",
    assigneeColor:
      "linear-gradient(90deg, rgba(2, 0, 36, 1) 0%, rgba(9, 9, 121, 1) 11%, rgba(0, 212, 255, 1) 100%)",
  },
];

const priorityColors: Record<Task["priority"], string> = {
  low: "var(--green)",
  medium: "var(--amber)",
  high: "var(--danger)",
};

const statusStyle: Record<Task["status"], string> = {
  "In Progress": "bg-(--amber-dim) text-(--amber)",
  Todo: "bg-(--accent-dim) text-(--accent)",
  Done: "bg-(--green-dim) text-(--green)",
};

export default function RecentTasks() {
  return (
    <div className="border rounded-(--radius) border-(--border2) bg-(--bg1) overflow-hidden mb-2">
      {/* Header */}
      <CardHeader
        title="Recent Tasks"
        dotColor="var(--orange)"
        action={{ label: "View all \u2192" }}
      />

      {/* Tasks */}

      <div>
        {tasks.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-2 px-3 py-2 border-b border-(--border) hover:bg-(--bg2)"
          >
            {/* Priority Dot */}
            <span
              className={`w-1.75 h-1.75 rounded-full`}
              style={{ backgroundColor: priorityColors[t.priority] }}
            ></span>
            {/* Task ID */}
            <div className="text-[10px] text-(--text3) font-mono w-14 shrink-0">
              {t.id}
            </div>
            {/* Task Name */}
            <div className="flex-1 truncate text-[13px] font-medium text-(--text1)">
              {t.name}
            </div>
            {/* Status Badge */}
            <span
              className={`inline-flex items-center gap-2 px-1.5 py-0.2 rounded-(--radius) ${statusStyle[t.status]}`}
            >
              <span className="w-1.5 h-1.5 bg-current rounded-full" />
              {t.status}
            </span>
            <div
              className="text-right rounded-full px-1.5 py-1"
              style={{ background: t.assigneeColor }}
            >
              {t.assignee}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
