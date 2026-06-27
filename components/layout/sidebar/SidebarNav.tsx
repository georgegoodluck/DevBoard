import NavLink from "./NavLink";
import { navItems, accountItems } from "./nav-items";

function SectionLabel({
  children,
  collapsed,
}: {
  children: React.ReactNode;
  collapsed: boolean;
}) {
  if (collapsed) return <div className="h-[20px]" />;
  return (
    <div className="pt-4 pb-1 pl-[14px] font-mono text-[10px] font-medium tracking-[0.12em] uppercase text-[var(--text3)]">
      {children}
    </div>
  );
}

export default function SidebarNav({ collapsed }: { collapsed: boolean }) {
  return (
    <nav className="flex-1 py-2">
      <SectionLabel collapsed={collapsed}>Workspace</SectionLabel>
      {navItems.map((item) => (
        <NavLink key={item.href} item={item} collapsed={collapsed} />
      ))}
      <SectionLabel collapsed={collapsed}>Account</SectionLabel>
      {accountItems.map((item) => (
        <NavLink key={item.href} item={item} collapsed={collapsed} />
      ))}
    </nav>
  );
}
