"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { api } from "@/lib/api";

export default function InvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    async function check() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push(
          `/register?redirectTo=${encodeURIComponent(`/invite?token=${token}`)}`,
        );
        return;
      }
      setCheckingAuth(false);
    }
    check();
  }, [router, token]);

  const acceptInvite = useMutation({
    mutationFn: () => api.post("/api/workspaces/invite/accept", { token }),
    onSuccess: () => {
      document.cookie = "devboard_has_workspace=1; path=/; max-age=31536000";
      router.push("/overview");
    },
  });

  if (!token) {
    return (
      <AuthShell>
        <p className="text-sm text-red">This invite link is missing a token.</p>
      </AuthShell>
    );
  }
  if (checkingAuth) {
    return (
      <AuthShell>
        <p className="text-sm text-text2">Checking your account…</p>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <h1 className="text-lg font-semibold">You&apos;ve been invited</h1>
      <p className="mt-2 text-sm text-text2">
        Accept to join the workspace and get started.
      </p>
      {acceptInvite.isError && (
        <p className="mt-3 text-xs text-red">
          {(acceptInvite.error as Error).message}
        </p>
      )}
      <button
        onClick={() => acceptInvite.mutate()}
        disabled={acceptInvite.isPending}
        className="mt-5 w-full rounded-devboard py-2 text-sm font-medium text-white brand-gradient disabled:opacity-50"
      >
        {acceptInvite.isPending ? "Joining…" : "Accept invite"}
      </button>
    </AuthShell>
  );
}

function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm rounded-devboard border border-border bg-bg1 p-6 text-center">
        {children}
      </div>
    </div>
  );
}
