"use client";

import { useSidebar } from "@/context/SidebarContext";
import SidebarLogo from "./SidebarLogo";
import SidebarNav from "./SidebarNav";
import SidebarUser from "./SidebarUser";

type Props = {
  user: { name: string; email: string; initials: string } | null;
};

export default function SidebarClient({ user }: Props) {
  const { collapsed } = useSidebar();

  return (
    <aside
      className="flex flex-col shrink-0 overflow-hidden border-r border-(--border) bg-(--bg1) transition-all duration-200"
      style={{
        width: collapsed ? "56px" : "var(--sidebar-width)",
        height: "100vh",
      }}
    >
      <SidebarLogo collapsed={collapsed} />
      <SidebarNav collapsed={collapsed} />
      <SidebarUser collapsed={collapsed} user={user} />
    </aside>
  );
}
