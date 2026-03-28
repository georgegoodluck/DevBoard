"use client";
import { usePathname } from "next/navigation";

const PageMeta: Record<string, { title: string; sub: string }> = {
  "/": { title: "Overview", sub: "Devboard workspace" },
  "/projects": { title: "Projects", sub: "6 active projects" },
  "/activity": { title: "Activity", sub: "Team feed" },
  "/settings": { title: "Settings", sub: "Account & workspace settings" },
};

export default function TopbarBreadcrumb() {
  const pathname = usePathname();
  const meta = PageMeta[pathname] ?? { title: "DevBoard", sub: "" };

  return (
    <div>
      <span>{meta.title}</span>
      <span>{meta.sub}</span>
    </div>
  );
}
