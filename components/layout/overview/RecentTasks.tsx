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
    assignee: "GE",
    assigneeColor: "red",
  },
  {
    id: "DBD-040",
    name: "Design settings page layout",
    status: "Todo",
    priority: "medium",
    assignee: "JD",
    assigneeColor: "red",
  },
  {
    id: "DBD-039",
    name: "Set up Drizzle ORM schema",
    status: "Done",
    priority: "low",
    assignee: "TM",
    assigneeColor: "red",
  },
  {
    id: "DBD-038",
    name: "Fix mobile sidebar overflow",
    status: "Done",
    priority: "low",
    assignee: "MO",
    assigneeColor: "red",
  },
  {
    id: "DBD-037",
    name: "Write Playwright E2E for auth flow",
    status: "Todo",
    priority: "medium",
    assignee: "GE",
    assigneeColor: "red",
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
      <div className="flex items-center justify-between px-3.5 py-3 border-b border-(--border)">
        <div className="flex items-center gap-2 text-[13px] text-(--text3) font-mono tracking-[0.02em] uppercase font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-(--accent-end)" />
          Recent Tasks
        </div>
        <span className="text-(--accent-end) font-mono text-[10px] cursor-pointer hover:opacity-70">
          View all &#8594;
        </span>
      </div>

      {/* Tasks */}

      <div>
        {tasks.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-2 px-3 py-2 border-b border-(--border)"
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
            <div className="text-right bg-(--danger) rounded-full px-1 py-1">
              {t.assignee}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
