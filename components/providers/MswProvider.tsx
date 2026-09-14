"use client";

import { useEffect, useState } from "react";

/**
 * Boots the MSW service worker before rendering children, but only when
 * NEXT_PUBLIC_USE_MOCK=true. In every other case this is a pure passthrough
 * with zero overhead — MSW's code isn't even imported.
 */
export function MswProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(process.env.NEXT_PUBLIC_USE_MOCK !== "true");

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_USE_MOCK !== "true") return;
    import("@/mocks/browser").then(({ worker }) => {
      worker.start({ onUnhandledRequest: "bypass" }).then(() => setReady(true));
    });
  }, []);

  if (!ready) return null;
  return <>{children}</>;
}
