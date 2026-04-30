import CardHeader from "@/components/ui/CardHeader";

type Setting = {
  label: string;
  description: string;
  key: string;
  default: boolean;
};

const settings: Setting[] = [
  {
    label: "Task assignments",
    description: "Notify when assigned to a task",
    key: "tasks",
    default: true,
  },
  {
    label: "PR & deployment alerts",
    description: "CI/CD and merge notifications",
    key: "prs",
    default: true,
  },
  {
    label: "Deadline reminders",
    description: "Remind 3 days before due date",
    key: "deadlines",
    default: false,
  },
  {
    label: "Weekly digest email",
    description: "Summary of team activity",
    key: "digest",
    default: true,
  },
  {
    label: "@mentions only",
    description: "Suppress all but direct mentions",
    key: "mentions",
    default: false,
  },
];

function Toggle({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="relative w-8 h-4 rounded-full transition-all shrink-0 cursor-pointer"
      style={{ background: enabled ? "var(--accent)" : "var(--border2)" }}
    >
      <div
        className="absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all"
        style={{ left: enabled ? "calc(100% - 14px)" : "2px" }}
      />
    </button>
  );
}

export default function NotificationSettings() {
  return (
    <div className="bg-(--bg1) rounded-(--radius) border border-(--border) overflow-hidden">
      <CardHeader title="Notifications" dotColor="var(--amber)" />
    </div>
  );
}
