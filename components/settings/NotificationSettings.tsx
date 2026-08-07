"use client";

import CardHeader from "@/components/ui/CardHeader";
import { useState } from "react";

type Setting = {
  label: string;
  description: string;
  key: string;
  default: boolean;
};

const settings: Setting[] = [
  {
    label: "Task assignments",
    description: "Notify when assigned to a task",
    key: "tasks",
    default: true,
  },
  {
    label: "PR & deployment alerts",
    description: "CI/CD and merge notifications",
    key: "prs",
    default: true,
  },
  {
    label: "Deadline reminders",
    description: "Remind 3 days before due date",
    key: "deadlines",
    default: false,
  },
  {
    label: "Weekly digest email",
    description: "Summary of team activity",
    key: "digest",
    default: true,
  },
  {
    label: "@mentions only",
    description: "Suppress all but direct mentions",
    key: "mentions",
    default: false,
  },
];

function Toggle({
  enabled,
  onToggle,
  id,
}: {
  enabled: boolean;
  onToggle: () => void;
  id: string;
}) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={enabled}
      onClick={onToggle}
      className={`
        relative w-11 h-6 rounded-full transition-all duration-200 
        shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 
        focus-visible:outline-(--accent)
        ${enabled ? "bg-(--accent)" : "bg-(--border2)"}
      `}
    >
      <span className="sr-only">
        {enabled ? "Enable" : "Disable"} {id.replace("toggle-", "")}
      </span>

      <div
        className={`
          absolute top-0.5 w-5 h-5 bg-white rounded-full 
          transition-all duration-200 shadow-sm
          ${enabled ? "translate-x-[22px]" : "translate-x-0.5"}
        `}
      />

      {/* Optional: Add subtle glow when enabled */}
      {enabled && (
        <div className="absolute inset-0 rounded-full animate-pulse opacity-30 bg-[var(--accent)]" />
      )}
    </button>
  );
}

export default function NotificationSettings() {
  const [state, setState] = useState(
    Object.fromEntries(settings.map((s) => [s.key, s.default])),
  );

  return (
    <div className="bg-[var(--bg1)] rounded-[var(--radius)] border border-[var(--border)] overflow-hidden">
      <CardHeader title="Notifications" dotColor="var(--amber)" />

      <div className="divide-y divide-[var(--border)]">
        {settings.map((setting) => (
          <div
            key={setting.key}
            className="flex items-center justify-between px-4 py-5 hover:bg-[var(--bg2)] transition-colors group"
          >
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-medium text-[var(--text)] mb-0.5 flex items-center gap-2">
                {setting.label}
                <span
                  className={`
                  text-[10px] font-mono px-1.5 py-0.5 rounded 
                  ${state[setting.key] ? "text-[var(--accent)] bg-[var(--accent-dim)]" : "text-[var(--text3)] bg-[var(--bg3)]"}
                `}
                >
                  {state[setting.key] ? "ON" : "OFF"}
                </span>
              </div>
              <div className="text-[11px] text-[var(--text3)]">
                {setting.description}
              </div>
            </div>
            <div className="ml-4 flex items-center gap-2">
              <Toggle
                id={`toggle-${setting.key}`}
                enabled={state[setting.key]}
                onToggle={() =>
                  setState((prev) => ({
                    ...prev,
                    [setting.key]: !prev[setting.key],
                  }))
                }
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
