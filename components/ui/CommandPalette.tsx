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

// Define the structure of a command in the palette
type Command = {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  action: () => void;
};

export default function CommandPalette() {
  // access the command palette state and close function from the context
  const { isOpen, close } = useCommandPalette();
  // search query state
  const [query, setQuery] = useState("");
  // currently highlighted command index for keyboard navigation
  const [isSelected, setIsSelected] = useState(0);
  // reference to the input element for focus management
  const inputRef = useRef<HTMLInputElement>(null);
  // for programmatic navigation
  const router = useRouter();
  // Command definitions with id, label, optional description, icon, and action to perform when selected. Each command navigates to a different page and closes the command palette afterward.
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

  // Filter commands based on the search query, making it case-insensitive and matching any part of the command label.
  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase()),
  );

  // Effects
  // Focus input when palette opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 10);
      setQuery("");
      setSelected(0);
    }
  }, [isOpen]);

  // Keyboard Navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!isOpen) return;
      // Arrow Down key moves the selection down the list of filtered commands. It prevents the default behavior (like scrolling) and updates the selected index, ensuring it doesn't go beyond the last item in the filtered list.
      if (e.key === "ArrowDown") {
        e.preventDefault();
        // moves selection down the list, ensuring it doesn't go beyond the last item.
        setSelected((prev) => Math.min(prev + 1, filtered.length - 1));
      }
      // Arrow Up key moves the selection up the list of filtered commands. It prevents the default behavior and updates the selected index, ensuring it doesn't go below zero.
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelected((prev) => Math.max(prev - 1, 0));
      }
      // Enter key
      if (e.key === "Enter" && filtered[selected]) {
        filtered[selected].action();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filtered, selected]);

  if (!isOpen) return null;

  return (
    <>
      <h1>Command Palette</h1>
    </>
  );
}
