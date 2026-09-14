import type { Task, TaskStatus } from "./task";

export type KanbanColumns = Record<TaskStatus, Task[]>;
