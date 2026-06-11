"use client";
import { Search } from "lucide-react";
import { useCommandPalette } from "@/context/CommandPaletteContext";

export default function TopbarSearch() {
  const { open } = useCommandPalette();
  return (
    <div
      onClick={open}
      className="flex items-center gap-3 px-3 bg-(--bg2) border border-(--border) rounded-(--radius) h-7.5 w-60 cursor-text text-(--text3) hover:bg-(--bg3)"
    >
      <Search size={14} />
      <span className="font-mono text-[11px]">Search...</span>
      <kbd className="bg-(--bg3) border border-(--border) rounded-(--radius) text-[10px] px-1.25 py-0.5 ml-auto">
        &#x2318;K
      </kbd>
    </div>
  );
}
