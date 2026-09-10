"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  LayoutDashboard,
  FolderKanban,
  Activity as ActivityIcon,
  Settings,
} from "lucide-react";
import { useCommandPalette } from "@/context/CommandPaletteContext";
import { cn } from "@/lib/cn";

interface Command {
  id: string;
  label: string;
  icon: typeof LayoutDashboard;
  onSelect: () => void;
}

export function CommandPalette() {
  const { isOpen, close } = useCommandPalette();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Command[] = useMemo(
    () => [
      {
        id: "overview",
        label: "Go to Overview",
        icon: LayoutDashboard,
        onSelect: () => router.push("/overview"),
      },
      {
        id: "projects",
        label: "Go to Projects",
        icon: FolderKanban,
        onSelect: () => router.push("/projects"),
      },
      {
        id: "activity",
        label: "Go to Activity",
        icon: ActivityIcon,
        onSelect: () => router.push("/activity"),
      },
      {
        id: "settings",
        label: "Go to Settings",
        icon: Settings,
        onSelect: () => router.push("/settings"),
      },
    ],
    [router],
  );

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen]);

  useEffect(() => setActiveIndex(0), [query]);

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Enter") {
        e.preventDefault();
        const cmd = filtered[activeIndex];
        if (cmd) {
          cmd.onSelect();
          close();
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filtered, activeIndex, close]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-24"
      onClick={close}
    >
      <div
        className="w-full max-w-lg rounded-devboard border border-border bg-bg2 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <Search className="h-4 w-4 text-text3" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search or jump to..."
            className="flex-1 bg-transparent text-sm text-text placeholder:text-text3 outline-none"
          />
          <kbd className="rounded border border-border2 px-1.5 py-0.5 text-[10px] text-text3">
            ESC
          </kbd>
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-text3">
              No results
            </p>
          )}
          {filtered.map((cmd, i) => (
            <button
              key={cmd.id}
              onClick={() => {
                cmd.onSelect();
                close();
              }}
              onMouseEnter={() => setActiveIndex(i)}
              className={cn(
                "flex w-full items-center gap-3 rounded-devboard px-3 py-2 text-left text-sm",
                i === activeIndex
                  ? "bg-[var(--accent-dim)] text-accent"
                  : "text-text2",
              )}
            >
              <cmd.icon className="h-4 w-4" />
              {cmd.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
