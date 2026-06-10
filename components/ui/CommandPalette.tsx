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
  name: string;
  description?: string;
  icon: React.ReactNode;
  action: () => void;
};

export default function CommandPalette() {
  const [isOpen, close] = useCommandPalette();
  const [query, setQuery] = useState("");
  const [isSelected, setIsSelected] = useState(0);

  return (
    <>
      <h1>Command Palette</h1>
    </>
  );
}
