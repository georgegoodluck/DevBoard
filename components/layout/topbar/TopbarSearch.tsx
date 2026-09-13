"use client";

import { useEffect } from "react";
import { Search } from "lucide-react";
import { useCommandPalette } from "@/context/CommandPaletteContext";

export function TopbarSearch() {
  const { open } = useCommandPalette();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        open();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <button
      onClick={open}
      className="flex w-64 items-center gap-2 rounded-devboard border border-border bg-bg2 px-3 py-1.5 text-sm text-text3 hover:border-border2"
    >
      <Search className="h-3.5 w-3.5" />
      Search...
      <kbd className="ml-auto rounded border border-border2 px-1 text-[10px]">
        ⌘K
      </kbd>
    </button>
  );
}
