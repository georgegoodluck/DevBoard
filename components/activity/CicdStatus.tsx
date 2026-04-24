import CardHeader from "../ui/CardHeader";

const pipelines = [
  { name: "TickrPay", status: "Passing" as const },
  { name: "Pulse", status: "Failed" as const },
  { name: "Fin·Snap", status: "Passing" as const },
  { name: "SubTrack", status: "Deploying" as const },
];

const statusConfig = {
  Passing: {
    bg: "var(--green-dim)",
    color: "var(--green)",
    glow: "0 0 6px var(--green)",
  },
  Failed: { bg: "var(--danger-dim)", color: "var(--danger)", glow: "none" },
  Deploying: { bg: "var(--amber-dim)", color: "var(--amber)", glow: "none" },
};

export default function CicdStatus() {
  return (
    <div className="bg-(--bg1) border border-(--border) rounded-(--radius) overflow-hidden">
      <CardHeader title="CI / CD Status" dotColor="var(--danger)" />
      <div className="p-2.5 flex flex-col gap-1.5">
        {pipelines.map((p) => {
          const s = statusConfig[p.status];
          return (
            <div
              key={p.name}
              className="flex items-center gap-2 px-2.5 py-1.75 rounded-sm"
              style={{ background: s.bg }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: s.color, boxShadow: s.glow }}
              ></span>
              <span className="flex-1 text-[12px] text-(--text)">{p.name}</span>
              <span className="font-mono text-[10px]" style={{ color: s.color }}>{p.status}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
