import NavLink from "./NavLink";
import { navItems, accountItems } from "./nav-items";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="pt-4 pb-1 pl-[14px] font-mono text-[10px] font-medium tracking-[0.12em] uppercase text-[var(--text3)]">
      {children}
    </div>
  );
}

export default function SidebarNav() {
  return (
    <nav className="flex-1 py-2">
      <SectionLabel>Workspace</SectionLabel>
      {navItems.map((item) => (
        <NavLink key={item.href} item={item} />
      ))}

      <SectionLabel>Account</SectionLabel>
      {accountItems.map((item) => (
        <NavLink key={item.href} item={item} />
      ))}
    </nav>
  );
}
