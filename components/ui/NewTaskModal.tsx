"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useNewTask } from "@/context/NewTaskContext";
import { api } from "@/lib/api";
import { cn } from "@/lib/cn";
import type { Project } from "@/types/project";
import type { TaskPriority, TaskStatus } from "@/types/task";

const STATUSES: TaskStatus[] = ["Todo", "In Progress", "In Review", "Done"];
const PRIORITIES: TaskPriority[] = ["high", "mid", "low"];

export function NewTaskModal() {
  const { isOpen, prefill, closeNewTask } = useNewTask();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState(prefill.projectId ?? "");
  const [status, setStatus] = useState<TaskStatus>(prefill.status ?? "Todo");
  const [priority, setPriority] = useState<TaskPriority>("mid");

  const { data } = useQuery({
    queryKey: ["projects"],
    queryFn: () => api.get<{ projects: Project[] }>("/api/projects"),
    enabled: isOpen,
  });

  const createTask = useMutation({
    mutationFn: () =>
      api.post("/api/tasks", {
        title,
        description,
        projectId,
        status,
        priority,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["kanban"] });
      reset();
      closeNewTask();
    },
  });

  function reset() {
    setTitle("");
    setDescription("");
    setProjectId("");
    setStatus("Todo");
    setPriority("mid");
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={closeNewTask}
    >
      <div
        className="w-full max-w-md rounded-devboard border border-border bg-bg2 p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold">New task</h2>
          <button onClick={closeNewTask} className="text-text3 hover:text-text">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (title.trim() && projectId) createTask.mutate();
          }}
        >
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            className="rounded-devboard border border-border bg-bg1 px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            rows={3}
            className="resize-none rounded-devboard border border-border bg-bg1 px-3 py-2 text-sm outline-none focus:border-accent"
          />

          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="rounded-devboard border border-border bg-bg1 px-3 py-2 text-sm outline-none focus:border-accent"
          >
            <option value="" disabled>
              Select a project
            </option>
            {data?.projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.emoji} {p.name}
              </option>
            ))}
          </select>

          <div className="flex gap-3">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="flex-1 rounded-devboard border border-border bg-bg1 px-3 py-2 text-sm outline-none focus:border-accent"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="flex-1 rounded-devboard border border-border bg-bg1 px-3 py-2 text-sm outline-none focus:border-accent"
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={createTask.isPending || !title.trim() || !projectId}
            className={cn(
              "mt-1 rounded-devboard py-2 text-sm font-medium text-white brand-gradient",
              (createTask.isPending || !title.trim() || !projectId) &&
                "opacity-50",
            )}
          >
            {createTask.isPending ? "Creating…" : "Create task"}
          </button>
        </form>
      </div>
    </div>
  );
}
