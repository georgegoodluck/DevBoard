"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, FolderKanban, Activity, Settings } from "lucide-react";

const tabs = [
  { label: "Overview", href: "/overview", icon: LayoutGrid },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "Activity", href: "/activity", icon: Activity },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-(--bg1) border-t border-(--border)"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      //   env(safe-area-inset-bottom) handles iphone notch/home indicator. Without this, the nav clips into the home bar on iPhones with no physical button.
    >
      <div className="flex items-center">
        {tabs.map((tab) => {
          const isActive =
            pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex-1 flex flex-col px-3 py-3 transition-colors ${isActive ? "text-(--accent)" : "text-(--text3)"}`}
            >
              <Icon size={20} />
              <span className="font-mono text-[9px] font-medium">
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
