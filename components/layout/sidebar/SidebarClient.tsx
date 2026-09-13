"use client";

import { useSidebar } from "@/context/SidebarContext";
import { cn } from "@/lib/cn";
import { SidebarLogo } from "./SidebarLogo";
import { SidebarNav } from "./SidebarNav";
import { SidebarUser } from "./SidebarUser";

export function SidebarClient() {
  const { collapsed, toggle } = useSidebar();

  return (
    <aside
      className={cn(
        "flex h-screen shrink-0 flex-col border-r border-border bg-bg1 transition-[width] duration-200",
        collapsed ? "w-16" : "w-sidebar",
      )}
    >
      <SidebarLogo collapsed={collapsed} />
      <SidebarNav collapsed={collapsed} />
      <SidebarUser collapsed={collapsed} onToggle={toggle} />
    </aside>
  );
}
