"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

export default function InvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }
    setStatus("ready");
  }, [token]);

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
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4">
      <div className="w-full max-w-[380px] text-center">
        <div className="flex items-center justify-center gap-2 mb-[40px]">
          <Image src="/icon.svg" alt="DevBoard" width={28} height={28} />
          <span className="font-mono text-[16px] font-semibold tracking-tight">
            <span className="text-[var(--text)]">Dev</span>
            <span className="brand-gradient-text">Board</span>
          </span>
        </div>

        <div className="bg-[var(--bg1)] border border-[var(--border)] rounded-[8px] p-[36px]">
          {status === "loading" && (
            <p className="font-mono text-[12px] text-[var(--text3)]">
              Loading...
            </p>
          )}

          {status === "error" && (
            <>
              <div className="text-[36px] mb-[12px]">❌</div>
              <p className="font-mono text-[13px] text-[var(--red)]">
                Invalid invite link
              </p>
            </>
          )}

          {status === "ready" && (
            <>
              <div className="text-[36px] mb-[16px]">👋</div>
              <h1 className="font-mono text-[15px] font-semibold text-[var(--text)] mb-[8px]">
                You&apos;ve been invited
              </h1>
              <p className="text-[12px] text-[var(--text3)] leading-relaxed mb-[24px]">
                Accept the invite to join your team&apos;s DevBoard workspace.
              </p>

              {error && (
                <p className="font-mono text-[11px] text-[var(--red)] mb-[12px]">
                  {error}
                </p>
              )}

              <button
                onClick={handleAccept}
                disabled={accepting}
                className="brand-gradient h-[36px] w-full rounded-[var(--radius)] text-white font-mono text-[12px] font-medium cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-40"
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
