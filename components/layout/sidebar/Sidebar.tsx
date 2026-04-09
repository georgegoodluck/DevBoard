// import SidebarLogo from "./SidebarLogo";
import SidebarLogo from "./SidebarLogo";
import SidebarNav from "./SidebarNav";
import SidebarUser from "./SidebarUser";

export default function Sidebar() {
  return (
    <aside
      className="flex flex-col shrink-0 overflow-hidden border-r border-(--border) bg-(--bg1)"
      style={{ width: "var(--sidebar-width)", height: "100vh" }}
    >
      <SidebarLogo />
      <SidebarNav />
      <SidebarUser />
    </aside>
  );
}
