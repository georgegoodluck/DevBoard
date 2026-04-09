type Deadline = {
  name: string;
  timeLeft: string;
  urgency: "critical" | "warning" | "good";
};

const deadlines: Deadline[] = [
  {
    name: "SubTrack v1 launch",
    timeLeft: "3 days",
    urgency: "critical",
  },
  {
    name: "Fin·snap final review",
    timeLeft: "9 days",
    urgency: "warning",
  },
  {
    name: "TickrPay alpha",
    timeLeft: "24 days",
    urgency: "good",
  },
];

const urgencyConfig = {
  critical: { border: "var(--danger)", bg: "var(--danger-dim)", text: "var(--danger)" },
  warning: {
    border: "var(--amber)",
    bg: "var(--amber-dim)",
    text: "var(--amber)",
  },
  good: {
    border: "var(--green)",
    bg: "var(--green-dim)",
    text: "var(--green)",
  },
};

export default function Deadline() {
  return (
    <div className="bg-(--bg1) border border-(--border) rounded-(--radius) overflow-hidden">
      <div className="flex items-center px-3 py-3 border-b border-(--border)">
        <div className="flex items-center font-mono font-semibold text-[13px] uppercase tracking-[0.08em] text-(--text2) gap-2">
          <span className="w-1.5 h-1.5 bg-(--danger) rounded-full"></span>
          Deadlines
        </div>
      </div>
      <div className="p-3.5 flex flex-col gap-2">
        {deadlines.map((d) => {
          const c = urgencyConfig[d.urgency];
          return (
            <div
              key={d.name}
              className="flex items-center gap-2 px-2.5 py-2 rounded-sm"
              style={{ background: c.bg, borderLeft: `2px solid ${c.border}` }}
            >
              <div className="flex-1 text-[12px] text-(--text)">{d.name}</div>
              <div className="font-mono text-[10px]" style={{ color: c.text }}>
                {d.timeLeft}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
