"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { api } from "@/lib/api";
import type { WorkspaceMember } from "@/types/workspace";

interface WorkspaceMeResponse {
  members: WorkspaceMember[];
  role: "owner" | "admin" | "member";
}

export function SidebarUser({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const { data } = useQuery({
    queryKey: ["workspace", "me"],
    queryFn: () => api.get<WorkspaceMeResponse>("/api/workspaces/me"),
  });

  // Best-effort "which member row is me" — full auth-user-to-member mapping
  // arrives with useWorkspace in the hooks step. For now just show the
  // first member as a placeholder if we can't resolve it (never crashes).
  const me = data?.members[0];

  return (
    <div className="mt-auto flex items-center gap-2 border-t border-border px-2 py-3">
      {me && (
        <div className="flex min-w-0 flex-1 items-center gap-2 px-1">
          <Avatar
            name={me.name}
            initials={me.initials}
            online={me.online}
            size="sm"
          />
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-text">
                {me.name}
              </p>
              <p className="truncate text-[10px] capitalize text-text3">
                {data?.role}
              </p>
            </div>
          )}
        </div>
      )}
      <button
        onClick={onToggle}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-devboard text-text3 hover:bg-bg3 hover:text-text"
      >
        {collapsed ? (
          <ChevronsRight className="h-4 w-4" />
        ) : (
          <ChevronsLeft className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
