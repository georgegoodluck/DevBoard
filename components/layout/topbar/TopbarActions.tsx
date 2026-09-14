"use client";

import { Bell, Plus } from "lucide-react";
import { useNewTask } from "@/context/NewTaskContext";

export function TopbarActions() {
  const { openNewTask } = useNewTask();

  return (
    <div className="flex items-center gap-2">
      <button
        title="Notifications (full panel arrives in Phase 7)"
        className="flex h-8 w-8 items-center justify-center rounded-devboard text-text2 hover:bg-bg3 hover:text-text"
      >
        <Bell className="h-4 w-4" />
      </button>
      <button
        onClick={() => openNewTask()}
        className="flex items-center gap-1.5 rounded-devboard px-3 py-1.5 text-sm font-medium text-white brand-gradient"
      >
        <Plus className="h-3.5 w-3.5" />
        New
      </button>
    </div>
  );
}
