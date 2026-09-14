"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useCreateProject } from "@/hooks/useProjects";
import { cn } from "@/lib/cn";

const EMOJI_OPTIONS = ["📁", "🚀", "🎯", "🛠️", "📊", "🎨", "🔧", "📱"];

export function NewProjectModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [emoji, setEmoji] = useState(EMOJI_OPTIONS[0]);
  const [tagsInput, setTagsInput] = useState("");
  const [due, setDue] = useState("");

  const createProject = useCreateProject();

  function reset() {
    setName("");
    setDescription("");
    setEmoji(EMOJI_OPTIONS[0]);
    setTagsInput("");
    setDue("");
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-devboard border border-border bg-bg2 p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold">New project</h2>
          <button onClick={onClose} className="text-text3 hover:text-text">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim()) return;
            createProject.mutate(
              {
                name,
                description: description || undefined,
                emoji,
                due: due ? new Date(due).toISOString() : undefined,
                tags: tagsInput
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean),
              },
              {
                onSuccess: () => {
                  reset();
                  onClose();
                },
              },
            );
          }}
        >
          <div className="flex gap-1.5">
            {EMOJI_OPTIONS.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setEmoji(e)}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-devboard border text-base",
                  emoji === e
                    ? "border-accent bg-[var(--accent-dim)]"
                    : "border-border bg-bg1",
                )}
              >
                {e}
              </button>
            ))}
          </div>

          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Project name"
            className="rounded-devboard border border-border bg-bg1 px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            rows={3}
            className="resize-none rounded-devboard border border-border bg-bg1 px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <input
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="Tags, comma separated (optional)"
            className="rounded-devboard border border-border bg-bg1 px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <input
            type="date"
            value={due}
            onChange={(e) => setDue(e.target.value)}
            className="rounded-devboard border border-border bg-bg1 px-3 py-2 text-sm text-text2 outline-none focus:border-accent"
          />

          <button
            type="submit"
            disabled={createProject.isPending || !name.trim()}
            className={cn(
              "mt-1 rounded-devboard py-2 text-sm font-medium text-white brand-gradient",
              (createProject.isPending || !name.trim()) && "opacity-50",
            )}
          >
            {createProject.isPending ? "Creating…" : "Create project"}
          </button>
        </form>
      </div>
    </div>
  );
}
