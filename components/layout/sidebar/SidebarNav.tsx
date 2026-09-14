import { navItems } from "./nav-items";
import { NavLink } from "./NavLink";

export function SidebarNav({ collapsed }: { collapsed: boolean }) {
  return (
    <nav className="flex flex-col gap-1 px-2">
      {navItems.map((item) => (
        <NavLink key={item.href} item={item} collapsed={collapsed} />
      ))}
    </nav>
  );
}
