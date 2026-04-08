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
