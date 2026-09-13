"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      setError(error.message);
      return;
    }

    // The cookie only ever gets set by onboarding/invite-accept, so a
    // fresh session (cleared cookies, new device, incognito) would
    // otherwise look indistinguishable from "never onboarded" and wrongly
    // bounce an existing member back to onboarding. Ask the backend for
    // the real answer instead of assuming.
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/workspaces/me`,
      {
        headers: { Authorization: `Bearer ${data.session.access_token}` },
      },
    );

    setLoading(false);

    if (res.ok) {
      document.cookie = "devboard_has_workspace=1; path=/; max-age=31536000";
      router.push("/overview");
    } else {
      router.push("/onboarding");
    }
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm rounded-devboard border border-border bg-bg1 p-6">
        <h1 className="text-lg font-semibold">Welcome back</h1>
        <p className="mt-1 text-sm text-text2">Log in to your workspace.</p>

        <form onSubmit={handleLogin} className="mt-6 flex flex-col gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="rounded-devboard border border-border bg-bg1 px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="rounded-devboard border border-border bg-bg1 px-3 py-2 text-sm outline-none focus:border-accent"
          />
          {error && <p className="text-xs text-red">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="rounded-devboard py-2 text-sm font-medium text-white brand-gradient disabled:opacity-50"
          >
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-text3">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-accent">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
