"use client";

import { createContext, useContext, useState } from "react";

type ContextType = {
  collapsed: boolean;
  toggle: () => void;
};

const SidebarContext = createContext<ContextType | null>(null);
