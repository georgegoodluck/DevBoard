// import SidebarLogo from "./SidebarLogo";
import SidebarLogo from "./SidebarLogo";
import SidebarNav from "./SidebarNav";
import SidebarUser from "./SidebarUser";
// import { useSidebar } from "@/context/SidebarContext";

export default function Sidebar() {
  // const { collapsed } = useSidebar();

  return (
    <aside
      className="flex flex-col shrink-0 overflow-hidden border-r border-[var(--border)] bg-[var(--bg1)] transition-all duration-200"
      style={{
        width: "56px var(--sidebar-width)",
        height: "100vh",
      }}
    >
      <SidebarLogo />
      <SidebarNav />
      <SidebarUser />
    </aside>
  );
}
