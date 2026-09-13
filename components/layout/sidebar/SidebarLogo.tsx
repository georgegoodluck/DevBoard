import Link from "next/link";

export function SidebarLogo({ collapsed }: { collapsed: boolean }) {
  return (
    <Link href="/overview" className="flex items-center gap-2 px-3 py-4">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-devboard brand-gradient text-xs font-bold text-white">
        D
      </div>
      {!collapsed && (
        <span className="text-sm font-semibold text-text">DevBoard</span>
      )}
    </Link>
  );
}
