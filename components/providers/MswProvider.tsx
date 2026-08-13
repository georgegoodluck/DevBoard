"use client";

<<<<<<< HEAD
import { useEffect, useRef, useState } from "react";
=======
import { useEffect, useState, useRef } from "react";
>>>>>>> bd2248f (fix: fix knows issues)

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export default function MswProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(!USE_MOCK);
<<<<<<< HEAD
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
=======
  const isStarting = useRef(false);
  const isStarted = useRef(false);

  useEffect(() => {
    if (!USE_MOCK || isStarting.current || isStarted.current) {
      return;
    }
>>>>>>> bd2248f (fix: fix knows issues)

    isStarting.current = true;

    import("@/mocks/browser")
      .then(({ worker }) => {
        // Just try to start it - if it's already running, it will handle it gracefully
        return worker
          .start({
            onUnhandledRequest: "bypass",
          })
          .then(() => {
            console.log("✅ MSW started successfully");
            isStarted.current = true;
            setReady(true);
          });
      })
      .catch((error) => {
        // If error is about already being enabled, treat as success
        if (
          error?.message?.includes("already enabled") ||
          error?.message?.includes("already started")
        ) {
          console.log("✅ MSW already running");
          isStarted.current = true;
          setReady(true);
          return;
        }

        console.error("❌ MSW failed to start:", error);
        setReady(true); // Still render even if MSW fails
      })
      .finally(() => {
        isStarting.current = false;
      });
  }, [USE_MOCK]);

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-(--bg)">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-(--accent) border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-3 text-sm font-mono text-(--text3)">
            Starting mock service worker...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
