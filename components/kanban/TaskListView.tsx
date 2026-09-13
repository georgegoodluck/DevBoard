"use client";

import { StatusBadge, PriorityBadge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { useWorkspace } from "@/hooks/useWorkspace";
import type { Task } from "@/types/task";

export function TaskListView({
  tasks,
  onRowClick,
}: {
  tasks: Task[];
  onRowClick: (id: string) => void;
}) {
  const { members } = useWorkspace();
  const sorted = [...tasks].sort((a, b) => a.position - b.position);

  return (
    <div className="overflow-hidden rounded-devboard border border-border">
      <table className="w-full text-sm">
        <thead className="bg-bg1 text-left text-xs text-text3">
          <tr>
            <th className="px-3 py-2 font-medium">Title</th>
            <th className="px-3 py-2 font-medium">Status</th>
            <th className="px-3 py-2 font-medium">Priority</th>
            <th className="px-3 py-2 font-medium">Due</th>
            <th className="px-3 py-2 font-medium">Assignee</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {sorted.map((task) => {
            const assignee = members.find((m) => m.id === task.assigneeId);
            return (
              <tr
                key={task.id}
                onClick={() => onRowClick(task.id)}
                className="cursor-pointer bg-bg2 hover:bg-bg3"
              >
                <td className="px-3 py-2 text-text">{task.title}</td>
                <td className="px-3 py-2">
                  <StatusBadge status={task.status} />
                </td>
                <td className="px-3 py-2">
                  <PriorityBadge priority={task.priority} />
                </td>
                <td className="px-3 py-2 text-text3">
                  {task.due ? new Date(task.due).toLocaleDateString() : "—"}
                </td>
                <td className="px-3 py-2">
                  {assignee ? (
                    <Avatar
                      name={assignee.name}
                      initials={assignee.initials}
                      size="sm"
                    />
                  ) : (
                    <span className="text-text3">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
