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

export default function Deadline() {
  return (
    <div className="bg-(--bg1) border border-(--border) rounded-(--radius) overflow-hidden">
      <div className="flex items-center px-3.5 py-3">
        <div className="flex items-center font-mono font-semibold text-[13px] uppercase tracking-[0.08em] text-(--text2) gap-2">
          <span className="w-1.5 h-1.5 bg-(--danger) rounded-full"></span>
          Deadlines
        </div>
      </div>
    </div>
  );
}
