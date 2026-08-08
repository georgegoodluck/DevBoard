"use client";

import { useEffect, useState } from "react";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";
console.log("USE_MOCK:", USE_MOCK, process.env.NEXT_PUBLIC_USE_MOCK);

export default function MswProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(!USE_MOCK);

  useEffect(() => {
    if (!USE_MOCK) {
      return;
    }
    import("@/mocks/browser").then(({ worker }) => {
      worker.start({ onUnhandledRequest: "bypass" }).then(() => setReady(true));
    });
  }, []);

  if (!ready) return null;
  return <>{children}</>;
}
