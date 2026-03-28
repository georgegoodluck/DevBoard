"use client";
import { usePathname } from "next/navigation";

const pageMeta: Record<string, { title: string; sub: string }> = {
  "/overview": { title: "Overview", sub: "Devboard workspace" },
  "/projects": { title: "Projects", sub: "6 active projects" },
  "/activity": { title: "Activity", sub: "Team feed" },
  "/settings": { title: "Settings", sub: "Account & workspace settings" },
};

export default function TopbarBreadcrumb() {
  const pathname = usePathname();
  const meta = pageMeta[pathname] ?? { title: "DevBoard", sub: "" };

  return (
    <div className="flex items-center gap-3">
      <span>{meta.title}</span>
      <span className="text-[var(--text3)] select-none">/</span>
      <span className="text-[var(--text3)]">{meta.sub}</span>
    </div>
  );
}
