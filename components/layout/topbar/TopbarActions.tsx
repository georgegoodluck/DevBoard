"use client";

import { Plus } from "lucide-react";
import { useNewTask } from "@/context/NewTaskContext";

export default function TopbarActions() {
  const { open } = useNewTask();

  return (
    <div className="flex items-center">
      <button
        onClick={open}
        className="border border-(--border) rounded-(--radius) flex items-center gap-2 px-3 h-7.5 text-(--text3) font-mono hover:text-(--text1) hover:bg-(--bg2) cursor-pointer"
      >
        <Plus size={14} />
        New
      </button>
    </div>
  );
}
