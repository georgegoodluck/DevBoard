"use client";

import { useEffect } from "react";

export function EnsureWorkspaceCookie() {
  useEffect(() => {
    if (!document.cookie.includes("devboard_has_workspace=1")) {
      document.cookie = "devboard_has_workspace=1; path=/; max-age=31536000";
    }
  }, []);

  return null;
}
