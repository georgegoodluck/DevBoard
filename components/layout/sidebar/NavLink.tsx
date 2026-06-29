"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavItem } from "@/types/nav";

export default function NavLink({
  item,
  collapsed,
}: {
  item: NavItem;
  collapsed: boolean;
}) {
  const pathname = usePathname();
  const isActive = pathname === item.href;

  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      className={`
        relative flex items-center gap-[9px] mx-[6px] px-[10px] py-[7px]
        rounded-[var(--radius)] text-[12px] no-underline
        transition-colors duration-100
        ${collapsed ? "justify-center" : ""}
        ${
          isActive
            ? "bg-[var(--accent-dim)] text-[var(--accent)]"
            : "text-[var(--text2)] hover:bg-[var(--bg3)] hover:text-[var(--text)]"
        }
      `}
    >
      {isActive && !collapsed && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-[16px] bg-[var(--accent)] rounded-r-[2px]" />
      )}

      {item.icon}

      {!collapsed && <span className="text-sm">{item.label}</span>}

      {!collapsed && item.badge !== undefined && (
        <span className="ml-auto font-mono text-[10px] font-medium px-[6px] py-[1px] rounded-[3px] bg-[var(--accent-dim)] text-[var(--accent)]">
          {item.badge}
        </span>
      )}
    </Link>
  );
}
