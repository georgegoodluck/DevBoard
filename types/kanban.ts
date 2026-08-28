export type KanbanStatus = "Todo" | "In Progress" | "In Review" | "Done";

export type KanbanAssignee = {
  id: string;
  name: string;
  initials: string;
};

export type KanbanTask = {
  id: string;
  title: string;
  description: string;
  status: KanbanStatus;
  priority: number;
  due: string | null;
  labels: string[];
  assignee: KanbanAssignee[];
  createdAt: string;
};

export type KanbanColumns = Record<KanbanStatus, KanbanTask[]>;
