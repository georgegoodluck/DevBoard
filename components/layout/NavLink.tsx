"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavItems } from "@/types/nav";

export default function NavLink({ item }: { item: NavItems }) {
  const pathname = usePathname();
  const isActive = pathname === item.href;

  return (
    <Link
      href={item.href}
      className={`
        relative flex items-center gap-[9px] mx-[6px] px-[14px] py-[7px]
        rounded-[var(--radius)] text-[12px] no-underline
        transition-colors duration-100
        ${
          isActive
            ? "bg-[var(--accent-dim)] text-[var(--accent)]"
            : "text-[var(--text2)] hover:bg-[var(--bg3)] hover:text-[var(--text)]"
        }
      `}
    >
      {/* Active indicator bar */}
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-[16px] bg-[var(--accent)] rounded-r-[2px]" />
      )}

      {item.icon}
      <span>{item.label}</span>

      {/* Badge */}
      {item.badge !== undefined && (
        <span className="ml-auto font-mono text-[10px] font-medium px-[6px] py-[1px] rounded-[3px] bg-[var(--accent-dim)] text-[var(--accent)]">
          {item.badge}
        </span>
      )}
    </Link>
  );
}
