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
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="relative w-8 h-5 rounded-full transition-all shrink-0 cursor-pointer"
      style={{ background: enabled ? "var(--accent)" : "var(--border2)" }}
    >
      <div
        className="absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all shadow-sm"
        style={{ left: enabled ? "calc(100% - 18px)" : "2px" }}
      />
    </button>
  );
}

export default function NotificationSettings() {
  const [state, setState] = useState(
    Object.fromEntries(settings.map((s) => [s.key, s.default])),
  );

  return (
    <div className="bg-(--bg1) rounded-(--radius) border border-(--border) overflow-hidden">
      <CardHeader title="Notifications" dotColor="var(--amber)" />

      <div className="divide-y divide-(--border)">
        {settings.map((setting) => (
          <div
            key={setting.key}
            className="flex items-center justify-between px-4 py-5"
          >
            <div>
              <div className="text-[13px] font-medium text-(--text) mb-0.5">
                {setting.label}
              </div>
              <div className="text-[11px] text-(--text3)">
                {setting.description}
              </div>
            </div>
            <Toggle
              enabled={state[setting.key]}
              onToggle={() =>
                setState((prev) => ({
                  ...prev,
                  [setting.key]: !prev[setting.key],
                }))
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}
