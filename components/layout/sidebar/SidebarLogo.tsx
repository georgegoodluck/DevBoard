"use client";

import Image from "next/image";
import { PanelLeft, PanelRight } from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";

export default function SidebarLogo({ collapsed }: { collapsed: boolean }) {
  const { toggle } = useSidebar();

  return (
    <div
      className="flex items-center border-b border-[var(--border)] shrink-0 px-[14px]"
      style={{ height: "var(--topbar-height)" }}
    >
      {!collapsed && (
        <>
          <Image
            src="/icon.svg"
            alt="DevBoard"
            width={40}
            height={40}
            className="shrink-0"
          />
          <span className="font-mono text-[13px] font-semibold tracking-tight ml-2">
            <span className="text-[var(--text)]">Dev</span>
            <span className="brand-gradient-text">Board</span>
          </span>
        </>
      )}
      <button
        onClick={toggle}
        className={`${collapsed ? "mx-auto" : "ml-auto"} text-[var(--text3)] hover:text-[var(--text)] transition-colors cursor-pointer p-[4px] rounded-[var(--radius)] hover:bg-[var(--bg3)]`}
      >
        {collapsed ? <PanelRight size={20} /> : <PanelLeft size={20} />}
      </button>
    </div>
  );
}
