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

  return (
    <>
      <h1>Command Palette</h1>
    </>
  );
}
