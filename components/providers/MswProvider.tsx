"use client";

import { useEffect, useRef, useState } from "react";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export default function MswProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(!USE_MOCK);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!USE_MOCK || initializedRef.current) {
      return;
    }

    initializedRef.current = true;

    import("@/mocks/browser").then(({ worker }) => {
      worker.start({ onUnhandledRequest: "bypass" }).then(() => setReady(true));
    });
  }, []);

  if (!ready) return null;
  return <>{children}</>;
}
