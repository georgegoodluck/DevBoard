export interface Workspace {
  id: string;
  name: string;
  slug: string;
  plan: "free" | "pro";
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  name: string;
  email: string;
  initials: string;
  role: "owner" | "admin" | "member";
  online: boolean;
}
