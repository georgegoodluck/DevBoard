import type { Task } from "./task";

export interface Subtask {
  id: string;
  taskId: string;
  title: string;
  done: boolean;
  position: number;
}

export interface TaskComment {
  id: string;
  taskId: string;
  authorId: string;
  authorName: string;
  authorInitials: string;
  body: string;
  editedAt: string | null;
  createdAt: string;
}

export interface TaskDependency {
  id: string;
  blockerId: string;
  blockeeId: string;
}

export interface TaskDetail {
  task: Task;
  subtasks: Subtask[];
  comments: TaskComment[];
  blocks: TaskDependency[];
  blockedBy: TaskDependency[];
}
