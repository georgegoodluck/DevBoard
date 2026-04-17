export type ActivityEvent = {
  id: string;
  actor: string;
  action: string;
  target: string;
  project: string;
  time: string;
  type: "merge" | "task" | "comment" | "deploy" | "ci" | "update";
};
