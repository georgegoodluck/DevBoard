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
        relative flex items-center gap-2.25 mx-1.5 px-3.5 py-1.75
        rounded-(--radius) text-[12px] no-underline
        transition-colors duration-100
        ${
          isActive
            ? "bg-(--accent-dim) text-(--accent)"
            : "text-(--text2) hover:bg-(--bg3) hover:text-(--text)"
        }
      `}
    >
      {/* Active indicator bar */}
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-(--accent) rounded-r-0.5" />
      )}

      {item.icon}
      <span>{item.label}</span>

      {/* Badge */}
      {item.badge !== undefined && (
        <span className="ml-auto font-mono text-[10px] font-medium px-1.5 py-px rounded-[3px] bg-(--accent-dim) text-(--accent)">
          {item.badge}
        </span>
      )}
    </Link>
  );
}
