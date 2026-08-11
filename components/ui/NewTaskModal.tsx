"use client";

import { useState } from "react";
import { useNewTask } from "@/context/NewTaskContext";
import { X, Plus } from "lucide-react";
import { useCreateTask } from "@/hooks/useTasks";
import type { TaskPriority, TaskStatus } from "@/types/tasks";

const priorities = ["High", "Medium", "Low"] as const;
const statuses: TaskStatus[] = ["Todo", "In Progress", "Done"];
const projects = ["TickrPay", "Pulse", "fin·snap", "SubTrack", "DevBoard"];

// Map project names to IDs
const projectIdMap: Record<string, string> = {
  TickrPay: "proj-1",
  Pulse: "proj-2",
  "fin·snap": "proj-3",
  SubTrack: "proj-4",
  DevBoard: "proj-5",
};

export default function NewTaskModal() {
  const createTask = useCreateTask();
  const { isOpen, close } = useNewTask();

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Medium" as (typeof priorities)[number],
    status: "Todo" as TaskStatus,
    project: "DevBoard",
  });

  const isSubmitting = createTask.isPending ?? false;

  function handleSubmit() {
    if (!form.title.trim()) return;

    createTask.mutate(
      {
        title: form.title,
        description: form.description,
        priority: form.priority as TaskPriority,
        status: form.status,
        projectId: projectIdMap[form.project] || "proj-5",
        assignee: {
          initials: "GG",
          gradient: "linear-gradient(135deg,#8b5cf6,#06b6d4)",
        },
        createdAt: new Date().toISOString(),
      },
      {
        onSuccess: () => {
          close();
          setForm({
            title: "",
            description: "",
            priority: "Medium",
            status: "Todo",
            project: "DevBoard",
          });
        },
        onError: (error) => {
          console.error("Failed to create task:", error);
        },
      },
    );
  }

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-[50]" onClick={close} />

      {/* Modal */}
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-32px)] max-w-[480px] bg-[var(--bg1)] border border-[var(--border2)] rounded-[8px] z-[51] overflow-hidden"
        style={{ boxShadow: "0 24px 48px rgba(0,0,0,0.5)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-[16px] py-[12px] border-b border-[var(--border)]">
          <span className="font-mono text-[12px] font-medium text-[var(--text)]">
            New Task
          </span>
          <button
            onClick={close}
            className="text-[var(--text3)] hover:text-[var(--text)] transition-colors cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="p-[16px] flex flex-col gap-[12px]">
          {/* Title */}
          <input
            autoFocus
            placeholder="Task title..."
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full bg-transparent text-[14px] font-medium text-[var(--text)] placeholder:text-[var(--text3)] outline-none border-b border-[var(--border)] pb-[8px] focus:border-[var(--accent)] transition-colors"
          />

          {/* Description */}
          <textarea
            placeholder="Add a description..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--radius)] px-[10px] py-[8px] text-[12.5px] text-[var(--text)] placeholder:text-[var(--text3)] outline-none focus:border-[var(--accent)] transition-colors resize-none"
          />

          {/* Row of selects */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-[8px]">
            <select
              value={form.project}
              onChange={(e) => setForm({ ...form, project: e.target.value })}
              className="flex-1 bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--radius)] px-[10px] py-[6px] text-[11.5px] font-mono text-[var(--text)] outline-none focus:border-[var(--accent)] transition-colors cursor-pointer"
            >
              {projects.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <select
              value={form.priority}
              onChange={(e) =>
                setForm({
                  ...form,
                  priority: e.target.value as (typeof priorities)[number],
                })
              }
              className="bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--radius)] px-[10px] py-[6px] text-[11.5px] font-mono text-[var(--text)] outline-none focus:border-[var(--accent)] transition-colors cursor-pointer"
            >
              {priorities.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <select
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.value as TaskStatus,
                })
              }
              className="bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--radius)] px-[10px] py-[6px] text-[11.5px] font-mono text-[var(--text)] outline-none focus:border-[var(--accent)] transition-colors cursor-pointer"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-[8px] px-[16px] py-[12px] border-t border-[var(--border)] bg-[var(--bg2)]">
          <button
            onClick={close}
            className="font-mono text-[11px] h-[28px] px-[12px] rounded-[var(--radius)] border border-[var(--border2)] text-[var(--text2)] hover:bg-[var(--bg3)] hover:text-[var(--text)] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!form.title.trim() || isSubmitting}
            className="brand-gradient flex items-center gap-[6px] font-mono text-[11px] h-[28px] px-[12px] rounded-[var(--radius)] text-white cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus size={12} />
            {isSubmitting ? "Creating..." : "Create Task"}
          </button>
        </div>
      </div>
    </>
  );
}
