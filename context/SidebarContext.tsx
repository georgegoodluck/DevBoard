"use client";

import { createContext, useContext, useState } from "react";

type ContextType = {
  collapsed: boolean;
  toggle: () => void;
};

const SidebarContext = createContext<ContextType | null>(null);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <SidebarContext.Provider
      value={{
        collapsed,
        toggle: () => setCollapsed(!collapsed),
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used inside SidebarProvider");
  return ctx;
}
