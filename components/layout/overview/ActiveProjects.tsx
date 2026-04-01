import ProgressBar from "../../ui/ProgressBar";

type Projects = {
  name: string;
  description: string;
  status: "In Progress" | "Planning" | "Review" | "Active";
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
];

const statusStyles: Record<Projects["status"], string> = {
  "In Progress": "bg-(--amber-dim) text-(--amber)",
  Planning: "bg-(--accent-dim) text-(--accent)",
  Review: "bg-(--purple-dim) text-(--purple)",
  Active: "bg-(--green-dim) text-(--green)",
};

const progressColors: Record<Projects["status"], string> = {
  "In Progress": "var(--amber)",
  Planning: "var(--accent)",
  Review: "var(--purple)",
  Active: "var(--green)",
};

export default function ActiveProjects() {
  return (
    <div className="border rounded-(--radius) border-(--border2) bg-(--bg1) overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-3 border-b border-(--border)">
        <div className="flex items-center gap-2 font-mono text-(--text3) uppercase text-[13px] tracking-[0.02em] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-(--accent)" />
          Active Project
        </div>
        <span className="text-(--accent) font-mono text-[10px] cursor-pointer hover:opacity-70">
          View all &#8594;
        </span>
      </div>

      {/* Table */}

      <table className="w-full border-collapse">
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
            <tr key={p.name} className="border-b border-(--border)">
              <td className="px-3.5 py-2.5">
                <div className="text-[13px] font-medium text-(--text)">
                  {p.name}
                </div>
                <div className="text-(--text3) text-[11px]">
                  {p.description}
                </div>
              </td>

              <td className="px-3.5 py-2.5">
                <span
                  className={`inline-flex items-center gap-1 font-mono text-[10px] font-medium px-1.75 py-0.5 rounded-(--radius) ${statusStyles[p.status]}`}
                >
                  <span className="w-2 h-2 rounded-full bg-current" />
                  {p.status}
                </span>
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
  );
}
