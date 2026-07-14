"use client";

import { useState, useEffect, useRef } from "react";
import { useCommandPalette } from "@/context/CommandPaletteContext";
import { useRouter } from "next/navigation";
import {
  LayoutGrid,
  FolderKanban,
  Activity,
  Settings,
  Plus,
  Search,
  ArrowRight,
} from "lucide-react";

type Command = {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  action: () => void;
};

export default function CommandPalette() {
  const { isOpen, close } = useCommandPalette();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const commands: Command[] = [
    {
      id: "overview",
      label: "Go to Overview",
      icon: <LayoutGrid size={13} />,
      action: () => {
        router.push("/overview");
        close();
      },
    },
    {
      id: "projects",
      label: "Go to Projects",
      icon: <FolderKanban size={13} />,
      action: () => {
        router.push("/projects");
        close();
      },
    },
    {
      id: "activity",
      label: "Go to Activity",
      icon: <Activity size={13} />,
      action: () => {
        router.push("/activity");
        close();
      },
    },
    {
      id: "settings",
      label: "Go to Settings",
      icon: <Settings size={13} />,
      action: () => {
        router.push("/settings");
        close();
      },
    },
    {
      id: "new-task",
      label: "New Task",
      description: "Create a new task",
      icon: <Plus size={13} />,
      action: () => {
        close();
      },
    },
  ];

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase()),
  );

  // Focus input and reset state when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        setQuery("");
        setSelected(0);
      }, 10);
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (!isOpen) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelected((prev) => Math.min(prev + 1, filtered.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelected((prev) => Math.max(prev - 1, 0));
      }
      if (e.key === "Enter" && filtered[selected]) {
        filtered[selected].action();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, filtered, selected]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-[50]" onClick={close} />

      {/* Palette */}
      <div
        className="fixed top-[10%] left-1/2 -translate-x-1/2 w-[calc(100vw-32px)] max-w-[520px] bg-[var(--bg1)] border border-[var(--border2)] rounded-[8px] z-[51] overflow-hidden"
        style={{ boxShadow: "0 24px 48px rgba(0,0,0,0.5)" }}
      >
        {/* Search input */}
        <div className="flex items-center gap-[10px] px-[14px] border-b border-[var(--border)]">
          <Search size={14} className="text-[var(--text3)] shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelected(0);
            }}
            placeholder="Search commands..."
            className="flex-1 bg-transparent py-[14px] text-[13px] text-[var(--text)] placeholder:text-[var(--text3)] outline-none font-mono"
          />
          <kbd className="font-mono text-[10px] bg-[var(--bg3)] border border-[var(--border2)] rounded-[3px] px-[5px] py-[2px] text-[var(--text3)]">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="py-[6px]">
          {filtered.length === 0 ? (
            <div className="px-[14px] py-[24px] text-center font-mono text-[11px] text-[var(--text3)]">
              No results for &quot;{query}&quot;
            </div>
          ) : (
            filtered.map((cmd, i) => (
              <div
                key={cmd.id}
                onClick={cmd.action}
                onMouseEnter={() => setSelected(i)}
                className={`flex items-center gap-[10px] px-[14px] py-[9px] cursor-pointer transition-colors ${
                  i === selected ? "bg-[var(--bg3)]" : ""
                }`}
              >
                <div
                  className={`w-[26px] h-[26px] rounded-[5px] flex items-center justify-center shrink-0 ${
                    i === selected
                      ? "bg-[var(--accent-dim)] text-[var(--accent)]"
                      : "bg-[var(--bg3)] text-[var(--text3)]"
                  }`}
                >
                  {cmd.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12.5px] text-[var(--text)]">
                    {cmd.label}
                  </div>
                  {cmd.description && (
                    <div className="font-mono text-[10px] text-[var(--text3)]">
                      {cmd.description}
                    </div>
                  )}
                </div>
                {i === selected && (
                  <ArrowRight
                    size={12}
                    className="text-[var(--text3)] shrink-0"
                  />
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-[12px] px-[14px] py-[8px] border-t border-[var(--border)] bg-[var(--bg2)]">
          <span className="font-mono text-[10px] text-[var(--text3)]">
            <kbd className="bg-[var(--bg3)] border border-[var(--border2)] rounded-[3px] px-[4px] py-[1px] mr-[4px]">
              ↑↓
            </kbd>
            navigate
          </span>
          <span className="font-mono text-[10px] text-[var(--text3)]">
            <kbd className="bg-[var(--bg3)] border border-[var(--border2)] rounded-[3px] px-[4px] py-[1px] mr-[4px]">
              ↵
            </kbd>
            select
          </span>
          <span className="font-mono text-[10px] text-[var(--text3)]">
            <kbd className="bg-[var(--bg3)] border border-[var(--border2)] rounded-[3px] px-[4px] py-[1px] mr-[4px]">
              ESC
            </kbd>
            close
          </span>
        </div>
      </div>
    </>
  );
}
