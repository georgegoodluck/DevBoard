export type ActivityType =
  | "merge"
  | "task"
  | "comment"
  | "deploy"
  | "ci"
  | "update";

export type ActivityEvent = {
  id: string;
  actor: string;
  action: string;
  target: string;
  project: string;
  time: string;
  type: ActivityType;
};
