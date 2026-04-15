// data structure
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

export default function SprintVelocity() {
  // component logic
  const max = Math.max(...sprints.map((s) => s.value)); // finds highest value to use as reference - 32
  const MAX_BAR_HEIGHT = 52; // sets maximum pixel height for all bars so they scale relative to this value

  // Helper function to get gradient based on value percentage
  const getGradient = (value: number, isLast: boolean) => {
    const percent = value / max;

    if (isLast) {
      // Special gradient for current sprint
      return "linear-gradient(135deg, #a855f7, #06b6d4, #3b82f6)";
    }

    // Gradient intensity based on value
    if (percent >= 0.8) {
      return "linear-gradient(180deg, #60a5fa, #3b82f6, #2563eb)";
    } else if (percent >= 0.6) {
      return "linear-gradient(180deg, #818cf8, #6366f1, #4f46e5)";
    } else if (percent >= 0.4) {
      return "linear-gradient(180deg, #c084fc, #a855f7, #9333ea)";
    } else {
      return "linear-gradient(180deg, #e879f9, #d946ef, #c026d3)";
    }
  };

  return (
    <div className="bg-(--bg1) border border-(--border) rounded-md overflow-hidden mb-2">
      <div className="flex items-center justify-between px-3.5 py-3 border-b border-(--border)">
        <div className="flex items-center gap-2 font-mono text-[13px] uppercase tracking-[0.08em] text-(--text2) font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-(--purple)" />
          Sprint Velocity
        </div>
        <span className="font-mono text-[10px] text-(--text3)">
          Last 8 sprints
        </span>
      </div>

      <div className="p-3.5">
        <div className="flex items-end gap-1.5 h-12">
          {sprints.map((s, i) => {
            const isLast = i === sprints.length - 1;
            const barHeight = (s.value / max) * MAX_BAR_HEIGHT;

            return (
              <div
                key={s.label}
                className="flex flex-col items-center gap-1 flex-1"
              >
                <div
                  className="w-full rounded-t-xs transition-all duration-300"
                  style={{
                    height: `${barHeight}px`,
                    background: getGradient(s.value, isLast),
                    backgroundSize: "100% 100%",
                  }}
                />
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5 mt-1.5">
          {sprints.map((s, i) => {
            const isLast = i === sprints.length - 1;
            return (
              <div key={s.label} className="flex-1 text-center">
                <span
                  className={`font-mono text-[9px] ${
                    isLast ? "text-(--accent)" : "text-(--text3)"
                  }`}
                >
                  {s.label}
                  {isLast && " (current)"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
