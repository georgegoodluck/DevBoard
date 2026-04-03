const sprints = [
  { label: "S1", value: 18 },
  { label: "S2", value: 23 },
  { label: "S3", value: 15 },
  { label: "S4", value: 26 },
  { label: "S5", value: 21 },
  { label: "S6", value: 29 },
  { label: "S7", value: 24 },
  { label: "S8", value: 32 },
];

const max = Math.max(...sprints.map((s) => s.value));

export default function SprintVelocity() {
  const max = Math.max(...sprints.map((s) => s.value));
  const MAX_BAR_HEIGHT = 52; // pixels (leaves room for labels)

  return (
    <div className="bg-[var(--bg1)] border border-[var(--border)] rounded-[6px] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-[14px] py-[10px] border-b border-[var(--border)]">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--text2)]">
          <span className="w-[6px] h-[6px] rounded-full bg-[var(--purple)]" />
          Sprint Velocity
        </div>
        <span className="font-mono text-[10px] text-[var(--text3)]">
          Last 8 sprints
        </span>
      </div>

      {/* Chart */}
      <div className="p-[14px]">
        {/* Bars */}
        <div className="flex items-end gap-[6px] h-[60px]">
          {sprints.map((s, i) => {
            const isLast = i === sprints.length - 1;
            const barHeight = (s.value / max) * MAX_BAR_HEIGHT;
            return (
              <div
                key={s.label}
                className="flex flex-col items-center gap-1 flex-1"
              >
                <div
                  className="w-full rounded-t-[2px] transition-all duration-300"
                  style={{
                    height: `${barHeight}px`,
                    background: isLast
                      ? "linear-gradient(135deg, #8b5cf6, #06b6d4)"
                      : "var(--bg3)",
                    opacity: isLast ? 1 : 0.6 + i * 0.05,
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Labels */}
        <div className="flex items-center gap-[6px] mt-[6px]">
          {sprints.map((s, i) => {
            const isLast = i === sprints.length - 1;
            return (
              <div key={s.label} className="flex-1 text-center">
                <span
                  className={`font-mono text-[9px] ${
                    isLast ? "text-[var(--accent)]" : "text-[var(--text3)]"
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
