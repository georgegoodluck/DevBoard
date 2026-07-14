"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, Plus } from "lucide-react";
import { useCommandPalette } from "@/context/CommandPaletteContext";
import { useNewTask } from "@/context/NewTaskContext";

const pageTitles: Record<string, string> = {
  "/overview": "Overview",
  "/projects": "Projects",
  "/activity": "Activity",
  "/settings": "Settings",
};

export default function MobileTopbar() {
  const pathname = usePathname();
  const { open: openSearch } = useCommandPalette();
  const { open: openNewTask } = useNewTask();
  const title = pageTitles[pathname] ?? "DevBoard";

  return (
    <header
      className="flex items-center gap-3 px-4 shrink-0 border-b border-[var(--border)] bg-[var(--bg1)]"
      style={{ height: "var(--topbar-height)" }}
    >
      {/* Logo mark */}
      <Image src="/icon.svg" alt="DevBoard" width={20} height={20} />

      {/* Page title */}
      <span className="font-mono text-[13px] font-semibold text-[var(--text)] flex-1">
        {title}
      </span>

      {/* Actions */}
      <div className="flex items-center gap-[8px]">
        <button
          onClick={openSearch}
          className="w-[32px] h-[32px] flex items-center justify-center rounded-[var(--radius)] text-[var(--text3)] hover:text-[var(--text)] hover:bg-[var(--bg3)] transition-colors"
        >
          <Search size={16} />
        </button>
        <button
          onClick={openNewTask}
          className="w-[32px] h-[32px] flex items-center justify-center rounded-[var(--radius)] brand-gradient text-white"
        >
          <Plus size={16} />
        </button>
      </div>
    </header>
  );
}
