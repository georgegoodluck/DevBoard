import { LayoutDashboard } from "lucide-react";

export default function SidebarLogo() {
  return (
    <div
      className="flex items-center gap-2 px-4 border-b border-[var(--border)] shrink-0"
      style={{ height: "var(--topbar-height)" }}
    >
      <div className="flex items-center justify-center w-[22px] h-[22px] rounded-[4px] bg-[var(--accent)] shrink-0">
        <LayoutDashboard size={13} color="white" />
      </div>
      <span className="font-mono text-[13px] font-semibold tracking-tight text-[var(--text)]">
        Dev<span className="text-[var(--accent)]">Board</span>
      </span>
    </div>
  );
}