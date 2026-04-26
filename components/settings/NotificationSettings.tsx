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

export default function NotificationSettings() {
  return (
    <div className="border border-(--border) rounded-(--radius) bg-(--bg1 overflow-hidden">
      <CardHeader title="Notifications" dotColor="var-(--amber)" />
    </div>
  );
}
