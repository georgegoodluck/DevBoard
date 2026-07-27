"use client";

import { useEffect, useState } from "react";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export default function MswProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(!USE_MOCK); // ← Already correct!

  useEffect(() => {
    if (!USE_MOCK) {
      // No need to setState here - it's already ready!
      return;
    }
    import("@/mocks/browser").then(({ worker }) => {
      worker.start({ onUnhandledRequest: "bypass" }).then(() => setReady(true));
    });
  }, []);

  if (!ready) return null;
  return <>{children}</>;
}

// "use client";

// import { useEffect, useState } from "react";

// export default function MswProvider({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   // Start with true for production, false for development
//   const [ready, setReady] = useState(() => {
//     return process.env.NODE_ENV !== "development";
//   });

//   useEffect(() => {
//     if (process.env.NODE_ENV === "development") {
//       import("@/mocks/browser")
//         .then(({ worker }) => worker.start({ onUnhandledRequest: "bypass" }))
//         .then(() => {
//           console.log("✅ MSW started successfully");
//           setReady(true);
//         })
//         .catch((error) => {
//           console.error("❌ MSW failed to start:", error);
//           setReady(true); // Still render even if MSW fails
//         });
//     }
//     // No else needed - already set to true for production
//   }, []);

//   // Show loading state while MSW initializes (development only)
//   if (!ready) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-(--bg)">
//         <div className="text-center">
//           <div className="w-8 h-8 border-2 border-(--accent) border-t-transparent rounded-full animate-spin mx-auto" />
//           <p className="mt-3 text-sm font-mono text-(--text3)">
//             Starting mock service worker...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return <>{children}</>;
// }
