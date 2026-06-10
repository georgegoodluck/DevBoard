"use client";

import { createContext, useContext, useState, useEffect } from "react";

type ContextType = {
  isOpen: boolean;
  // 3 functions to change the state of the command palette
  open: () => void;
  close: () => void;
  toggle: () => void;
};

// Create the context with a default value of null
const CommandPaletteContext = createContext<ContextType | null>(null);

// Wrapper component to provide the context to its children
export function CommandPaletteProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((prev) => !prev);

  // Listen for ⌘K / Ctrl+K globally
  useEffect(() => {
    // Creates a keyboard event listener that's passed as e. If the user presses ⌘K or Ctrl+K, it prevents the default behavior and toggles the command palette. If the user presses Escape, it closes the command palette.
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toggle();
      }
      if (e.key === "Escape") close();
    }
    // attaches global window object - keydown event listener to the handleKeyDown function.
    window.addEventListener("keydown", handleKeyDown);
    // When the component unmounts, it removes the event listener to prevent memory leaks and unintended behavior.
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    // Broadcasts the state and functions to all children nested in the component provider context.
    <CommandPaletteContext.Provider value={{ isOpen, open, close, toggle }}>
      {children}
    </CommandPaletteContext.Provider>
  );
}

// Allows us to access the context value in any component that's a child of the CommandPaletteProvider.
export function useCommandPalette() {
  // throw a clear error if the hook is used outside of the provider context.
  const ctx = useContext(CommandPaletteContext);
  if (!ctx)
    throw new Error(
      "useCommandPalette must be used inside CommandPaletteProvider",
    );
  return ctx;
}
