"use client";

import { createContext, useContext, useState } from "react";

type ContextType = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const NewTaskContext = createContext<ContextType | null>(null);

export function NewTaskProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <NewTaskContext.Provider
      value={{
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
      }}
    >
      {children}
    </NewTaskContext.Provider>
  );
}

export function useNewTask() {
  const ctx = useContext(NewTaskContext);
  if (!ctx) throw new Error("useNewTask must be used inside NewTaskProvider");
  return ctx;
}
