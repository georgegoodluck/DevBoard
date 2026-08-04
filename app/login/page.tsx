"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) return;
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/overview");
    router.refresh();
  }

  async function handleOAuth(provider: "github" | "google") {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4">
      <div className="w-full max-w-[380px]">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-[40px]">
          <Image src="/icon.svg" alt="DevBoard" width={28} height={28} />
          <span className="font-mono text-[16px] font-semibold tracking-tight">
            <span className="text-[var(--text)]">Dev</span>
            <span className="brand-gradient-text">Board</span>
          </span>
        </div>

        {/* Card */}
        <div className="bg-[var(--bg1)] border border-[var(--border)] rounded-[8px] p-[28px]">
          <h1 className="font-mono text-[15px] font-semibold text-[var(--text)] mb-[4px]">
            Sign in
          </h1>
          <p className="text-[12px] text-[var(--text3)] mb-[24px]">
            Welcome back to your workspace
          </p>

          {/* OAuth buttons */}
          <div className="flex flex-col gap-[8px] mb-[20px]">
            <button
              onClick={() => handleOAuth("github")}
              className="flex items-center justify-center gap-[8px] h-[36px] w-full rounded-[var(--radius)] border border-[var(--border2)] bg-[var(--bg2)] text-[var(--text)] font-mono text-[12px] cursor-pointer hover:bg-[var(--bg3)] transition-colors"
            >
              <span>🐙</span> Continue with GitHub
            </button>
            <button
              onClick={() => handleOAuth("google")}
              className="flex items-center justify-center gap-[8px] h-[36px] w-full rounded-[var(--radius)] border border-[var(--border2)] bg-[var(--bg2)] text-[var(--text)] font-mono text-[12px] cursor-pointer hover:bg-[var(--bg3)] transition-colors"
            >
              <span>G</span> Continue with Google
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-[10px] mb-[20px]">
            <div className="flex-1 h-[1px] bg-[var(--border)]" />
            <span className="font-mono text-[10px] text-[var(--text3)]">
              or
            </span>
            <div className="flex-1 h-[1px] bg-[var(--border)]" />
          </div>

          {/* Email + password */}
          <div className="flex flex-col gap-[10px]">
            <div>
              <label className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--text3)] mb-[4px] block">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="george@devboard.app"
                className="w-full bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--radius)] px-[10px] py-[7px] text-[12.5px] text-[var(--text)] placeholder:text-[var(--text3)] outline-none focus:border-[var(--accent)] transition-colors"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--text3)] mb-[4px] block">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="••••••••"
                className="w-full bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--radius)] px-[10px] py-[7px] text-[12.5px] text-[var(--text)] placeholder:text-[var(--text3)] outline-none focus:border-[var(--accent)] transition-colors"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="font-mono text-[11px] text-[var(--red)]">{error}</p>
            )}

            <button
              onClick={handleLogin}
              disabled={loading || !email || !password}
              className="brand-gradient h-[36px] w-full rounded-[var(--radius)] text-white font-mono text-[12px] font-medium cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed mt-[4px]"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </div>

        <p className="text-center font-mono text-[11px] text-[var(--text3)] mt-[20px]">
          Don&apos;t have an account?{" "}
          <span className="text-[var(--accent)] cursor-pointer hover:opacity-70">
            Contact your admin
          </span>
        </p>
      </div>
    </div>
  );
}
