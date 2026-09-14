export type SprintStatus = "planned" | "active" | "completed";

export interface Sprint {
  id: string;
  workspaceId: string;
  projectId: string;
  name: string;
  goal: string | null;
  status: SprintStatus;
  startDate: string;
  endDate: string;
}
