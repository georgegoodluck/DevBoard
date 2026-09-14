"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { createClient } from "@/lib/supabase/client";
import type { Workspace, WorkspaceMember } from "@/types/workspace";

interface WorkspaceMeResponse {
  workspace: Workspace;
  members: WorkspaceMember[];
  role: "owner" | "admin" | "member";
}

export function useWorkspace() {
  const [authUserId, setAuthUserId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth
      .getUser()
      .then(({ data }) => setAuthUserId(data.user?.id ?? null));
  }, []);

  const query = useQuery({
    queryKey: ["workspace", "me"],
    queryFn: () => api.get<WorkspaceMeResponse>("/api/workspaces/me"),
  });

  const me = query.data?.members.find((m) => m.userId === authUserId);

  return {
    ...query,
    workspace: query.data?.workspace,
    members: query.data?.members ?? [],
    role: query.data?.role,
    me,
  };
}
