"use client";



export default function Sidebar() {
  const { collapsed } = useSidebar();

  return (
    <aside
      className="flex flex-col shrink-0 overflow-hidden border-r border-[var(--border)] bg-[var(--bg1)] transition-all duration-200"
      style={{
        width: collapsed ? "56px" : "var(--sidebar-width)",
        height: "100vh",
      }}
    >
      <SidebarLogo collapsed={collapsed} />
      <SidebarNav collapsed={collapsed} />
      <SidebarUser collapsed={collapsed} />
    </aside>
  );
}
