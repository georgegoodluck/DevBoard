"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

export default function InvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const token = searchParams.get("token");

  // Derive status directly instead of using useEffect
  const status = token ? "ready" : "error";

  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState("");

  async function handleAccept() {
    setAccepting(true);
    setError("");

    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Not logged in — send to register with token preserved
    if (!session) {
      router.push(`/register?invite=${token}`);
      return;
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/workspaces/invite/accept`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ token }),
      },
    );

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to accept invite");
      setAccepting(false);
      return;
    }

    router.push("/overview");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-(--bg) flex items-center justify-center p-4">
      <div className="w-full max-w-95 text-center">
        <div className="flex items-center justify-center gap-2 mb-10">
          <Image src="/icon.svg" alt="DevBoard" width={28} height={28} />
          <span className="font-mono text-[16px] font-semibold tracking-tight">
            <span className="text-(--text)">Dev</span>
            <span className="brand-gradient-text">Board</span>
          </span>
        </div>

        <div className="bg-(--bg1) border border-(--border) rounded-lg p-9">
          {status === "error" && (
            <>
              <div className="text-[36px] mb-3">❌</div>
              <p className="font-mono text-[13px] text-(--red)">
                Invalid invite link
              </p>
            </>
          )}

          {status === "ready" && (
            <>
              <div className="text-[36px] mb-4">👋</div>
              <h1 className="font-mono text-[15px] font-semibold text-(--text) mb-2">
                You&apos;ve been invited
              </h1>
              <p className="text-[12px] text-(--text3) leading-relaxed mb-6">
                Accept the invite to join your team&apos;s DevBoard workspace.
              </p>

              {error && (
                <p className="font-mono text-[11px] text-(--red) mb-3">
                  {error}
                </p>
              )}

              <button
                onClick={handleAccept}
                disabled={accepting}
                className="brand-gradient h-9 w-full rounded-(--radius) text-white font-mono text-[12px] font-medium cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                {accepting ? "Joining..." : "Accept invite →"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
