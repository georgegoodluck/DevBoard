"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { useCreateTask } from "@/hooks/useTasks";
import type { TaskStatus } from "@/types/task";

export function AddTaskButton({
  projectId,
  status,
}: {
  projectId: string;
  status: TaskStatus;
}) {
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const createTask = useCreateTask();

  function submit() {
    const trimmed = title.trim();
    if (!trimmed) {
      setAdding(false);
      return;
    }
    createTask.mutate(
      { title: trimmed, projectId, status },
      { onSuccess: () => setTitle("") },
    );
  }

  if (!adding) {
    return (
      <button
        onClick={() => setAdding(true)}
        className="flex items-center gap-1.5 rounded-devboard px-2 py-1.5 text-xs text-text3 hover:bg-bg3 hover:text-text2"
      >
        <Plus className="h-3.5 w-3.5" />
        Add task
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-1.5 rounded-devboard border border-border bg-bg1 p-2">
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            submit();
          }
          if (e.key === "Escape") {
            setTitle("");
            setAdding(false);
          }
        }}
        onBlur={() => {
          if (!title.trim()) setAdding(false);
        }}
        placeholder="Task title"
        className="bg-transparent text-sm text-text outline-none placeholder:text-text3"
      />
      <div className="flex items-center gap-2 text-[10px] text-text3">
        <span>Enter to add</span>
        <button
          onClick={() => {
            setTitle("");
            setAdding(false);
          }}
          className="ml-auto flex items-center gap-0.5 hover:text-text2"
        >
          <X className="h-3 w-3" /> Esc
        </button>
      </div>
    </div>
  );
}
