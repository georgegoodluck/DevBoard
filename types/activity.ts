export type ActivityType = "merge" | "task" | "comment" | "deploy" | "ci" | "update";

export interface ActivityEvent {
  id: string;
  workspaceId: string;
  userId: string;
  actor: string;
  action: string;
  target: string;
  project: string | null;
  type: ActivityType;
  createdAt: string;
}
