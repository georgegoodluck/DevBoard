import ProgressBar from "../ui/ProgressBar";
import CardHeader from "@/components/ui/CardHeader";
import Badge from "@/components/ui/Badge";
import type { BadgeVariant } from "@/components/ui/Badge";

type Projects = {
  name: string;
  description: string;
  status: "In Progress" | "Planning" | "Review" | "Active" | "Closed";
  progress: number;
  due: string;
};

const projects: Projects[] = [
  {
    name: "TickrPay",
    description: "Event payments & ID",
    status: "In Progress",
    progress: 62,
    due: "Apr 12",
  },
  {
    name: "Pulse",
    description: "Dev activity dashboard",
    status: "Planning",
    progress: 21,
    due: "May 01",
  },
  {
    name: "Fin·Snap",
    description: "Finance tracker",
    status: "Review",
    progress: 81,
    due: "Mar 28",
  },
  {
    name: "SubTrack",
    description: "Subscription SaaS",
    status: "Active",
    progress: 95,
    due: "Mar 22",
  },
  {
    name: "MediPager",
    description: "Healthcare SaaS",
    status: "Closed",
    progress: 5,
    due: "Dec 01",
  },
];

const statusToVariant: Record<Projects["status"], BadgeVariant> = {
  "In Progress": "amber",
  Planning: "blue",
  Review: "purple",
  Active: "green",
  Closed: "red",
};

const progressColors: Record<Projects["status"], string> = {
  "In Progress": "var(--amber)",
  Planning: "var(--accent)",
  Review: "var(--purple)",
  Active: "var(--green)",
  Closed: "var(--danger)",
};

export default function ActiveProjects() {
  return (
    <div className="border rounded-(--radius) border-(--border2) bg-(--bg1) overflow-hidden mb-2">
      {/* Header */}
      <CardHeader
        title="Active Project"
        dotColor="var(--accent)"
        action={{ label: "View all \u2192" }}
      />

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[480px]">
          <thead>
            <tr>
              {["Project", "Status", "Progress", "Due"].map((h) => (
                <th
                  key={h}
                  className="text-left font-mono text-[12px] uppercase text-(--text3) px-3.5 py-2 border-b border-(--border)"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {projects.map((p) => (
              <tr
                key={p.name}
                className="border-b border-(--border) hover:bg-(--bg2) transition-colors"
              >
                <td className="px-3.5 py-2.5">
                  <div className="text-[13px] font-medium text-(--text)">
                    {p.name}
                  </div>
                  <div className="text-(--text3) text-[11px] hidden sm:block">
                    {p.description}
                  </div>
                </td>

                <td className="px-3.5 py-2.5">
                  <Badge label={p.status} variant={statusToVariant[p.status]} />
                </td>

                <td className="px-3.5 py-2.5">
                  {/* Progress bar */}
                  <ProgressBar
                    value={p.progress}
                    color={progressColors[p.status]}
                  />
                </td>

                <td className="px-3.5 py-2.5">
                  <span className="text-(--text3) text-[10px] font-mono">
                    {p.due}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
