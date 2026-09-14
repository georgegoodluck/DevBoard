"use client";

import { CardHeader } from "@/components/ui/CardHeader";
import { Avatar } from "@/components/ui/Avatar";
import { useWorkspace } from "@/hooks/useWorkspace";

export function TeamPanel() {
  const { members } = useWorkspace();

  return (
    <div className="rounded-devboard border border-border bg-bg1 p-4">
      <CardHeader
        title="Team"
        subtitle={`${members.length} member${members.length === 1 ? "" : "s"}`}
      />
      <div className="flex flex-col gap-3">
        {members.map((member) => (
          <div key={member.id} className="flex items-center gap-3">
            <Avatar
              name={member.name}
              initials={member.initials}
              online={member.online}
              size="sm"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-text">{member.name}</p>
              <p className="truncate text-xs capitalize text-text3">
                {member.role}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
