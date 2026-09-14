"use client";

import { useEffect, useRef, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanCard } from "./KanbanCard";
import { useKanban, useMoveTask } from "@/hooks/useKanban";
import { useWorkspace } from "@/hooks/useWorkspace";
import { positionForInsert } from "@/lib/position";
import type { KanbanColumns } from "@/types/kanban";
import type { Task, TaskStatus } from "@/types/task";

const COLUMN_ORDER: TaskStatus[] = ["Todo", "In Progress", "In Review", "Done"];
const EMPTY_COLUMNS: KanbanColumns = {
  Todo: [],
  "In Progress": [],
  "In Review": [],
  Done: [],
};

interface KanbanBoardProps {
  projectId: string;
  onCardClick: (taskId: string) => void;
}

export function KanbanBoard({ projectId, onCardClick }: KanbanBoardProps) {
  const { data, isLoading } = useKanban(projectId);
  const { members } = useWorkspace();
  const moveTask = useMoveTask();

  const [columns, setColumns] = useState<KanbanColumns>(EMPTY_COLUMNS);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    if (data && !isDragging.current) setColumns(data);
  }, [data]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
  );

  function findColumnOf(taskId: string): TaskStatus | null {
    for (const status of COLUMN_ORDER) {
      if (columns[status].some((t) => t.id === taskId)) return status;
    }
    return null;
  }

  function handleDragStart(event: DragStartEvent) {
    isDragging.current = true;
    const task = Object.values(columns)
      .flat()
      .find((t) => t.id === event.active.id);
    setActiveTask(task ?? null);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const fromStatus = findColumnOf(activeId);
    const toStatus = (COLUMN_ORDER as string[]).includes(overId)
      ? (overId as TaskStatus)
      : findColumnOf(overId);

    if (!fromStatus || !toStatus || fromStatus === toStatus) return;

    setColumns((prev) => {
      const fromTasks = prev[fromStatus];
      const task = fromTasks.find((t) => t.id === activeId);
      if (!task) return prev;

      const toTasks = prev[toStatus];
      const overIndex = toTasks.findIndex((t) => t.id === overId);
      const insertAt = overIndex === -1 ? toTasks.length : overIndex;

      return {
        ...prev,
        [fromStatus]: fromTasks.filter((t) => t.id !== activeId),
        [toStatus]: [
          ...toTasks.slice(0, insertAt),
          { ...task, status: toStatus },
          ...toTasks.slice(insertAt),
        ],
      };
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    isDragging.current = false;
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;
    const status = findColumnOf(activeId);
    if (!status) return;

    const tasksInColumn = columns[status];
    const activeIndex = tasksInColumn.findIndex((t) => t.id === activeId);
    let overIndex = tasksInColumn.findIndex((t) => t.id === overId);
    if (overIndex === -1) overIndex = tasksInColumn.length - 1;

    const reordered = [...tasksInColumn];
    const [moved] = reordered.splice(activeIndex, 1);
    reordered.splice(overIndex, 0, moved!);
    setColumns((prev) => ({ ...prev, [status]: reordered }));

    const finalIndex = reordered.findIndex((t) => t.id === activeId);
    const others = reordered.filter((t) => t.id !== activeId);
    const position = positionForInsert(others, finalIndex);

    moveTask.mutate({ taskId: activeId, projectId, status, position });
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMN_ORDER.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={columns[status]}
            members={members}
            projectId={projectId}
            isLoading={isLoading}
            onCardClick={onCardClick}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask && (
          <div className="rotate-3">
            <KanbanCard
              task={activeTask}
              assignee={members.find((m) => m.id === activeTask.assigneeId)}
              onClick={() => {}}
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
