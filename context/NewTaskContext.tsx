"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { TaskStatus } from "@/types/task";

interface NewTaskPrefill {
  projectId?: string;
  status?: TaskStatus;
}

interface NewTaskContextValue {
  isOpen: boolean;
  prefill: NewTaskPrefill;
  openNewTask: (prefill?: NewTaskPrefill) => void;
  closeNewTask: () => void;
}

const NewTaskContext = createContext<NewTaskContextValue | null>(null);

export function NewTaskProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [prefill, setPrefill] = useState<NewTaskPrefill>({});

  return (
    <NewTaskContext.Provider
      value={{
        isOpen,
        prefill,
        openNewTask: (p = {}) => {
          setPrefill(p);
          setIsOpen(true);
        },
        closeNewTask: () => setIsOpen(false),
      }}
    >
      {children}
    </NewTaskContext.Provider>
  );
}

export function useNewTask() {
  const ctx = useContext(NewTaskContext);
  if (!ctx) throw new Error("useNewTask must be used within NewTaskProvider");
  return ctx;
}
