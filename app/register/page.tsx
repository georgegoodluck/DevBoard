"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Github } from "lucide-react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  async function handleEmailSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSubmitted(true);
  }

  async function handleOAuth(provider: "github" | "google") {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  if (submitted) {
    return (
      <AuthShell>
        <h1 className="text-lg font-semibold">Check your inbox</h1>
        <p className="mt-2 text-sm text-text2">
          We sent a verification link to <strong>{email}</strong>. Click it to
          activate your account.
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <h1 className="text-lg font-semibold">Create your account</h1>
      <p className="mt-1 text-sm text-text2">
        Start managing your team&apos;s work in minutes.
      </p>

      <div className="mt-6 flex flex-col gap-2">
        <OAuthButton provider="github" onClick={() => handleOAuth("github")} />
        <OAuthButton provider="google" onClick={() => handleOAuth("google")} />
      </div>

      <div className="my-5 flex items-center gap-3 text-xs text-text3">
        <div className="h-px flex-1 bg-border" />
        or
        <div className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleEmailSignup} className="flex flex-col gap-3">
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
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password (min. 8 characters)"
          className="rounded-devboard border border-border bg-bg1 px-3 py-2 text-sm outline-none focus:border-accent"
        />
        {error && <p className="text-xs text-red">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded-devboard py-2 text-sm font-medium text-white brand-gradient disabled:opacity-50"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-5 text-center text-xs text-text3">
        Already have an account?{" "}
        <Link href="/login" className="text-accent">
          Log in
        </Link>
      </p>
    </AuthShell>
  );
}

function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm rounded-devboard border border-border bg-bg1 p-6">
        {children}
      </div>
    </div>
  );
}

function OAuthButton({
  provider,
  onClick,
}: {
  provider: "github" | "google";
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-2 rounded-devboard border border-border2 bg-bg2 py-2 text-sm font-medium text-text hover:bg-bg3"
    >
      {provider === "github" ? <Github className="h-4 w-4" /> : <GoogleIcon />}
      Continue with {provider === "github" ? "GitHub" : "Google"}
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.85A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09A6.6 6.6 0 0 1 5.5 12c0-.73.12-1.43.34-2.09V7.06H2.18A11 11 0 0 0 1 12c0 1.77.43 3.45 1.18 4.94z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a11 11 0 0 0-9.82 6.06l3.66 2.85C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}
