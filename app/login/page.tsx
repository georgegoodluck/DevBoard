"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

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
    <div className="min-h-screen bg-(--bg) flex items-center justify-center p-4">
      <div className="w-full max-w-95">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <Image src="/icon.svg" alt="DevBoard" width={28} height={28} />
          <span className="font-mono text-[16px] font-semibold tracking-tight">
            <span className="text-(--text)">Dev</span>
            <span className="brand-gradient-text">Board</span>
          </span>
        </div>

        {/* Card */}
        <div className="bg-(--bg1) border border-(--border) rounded-lg p-7">
          <h1 className="font-mono text-[15px] font-semibold text-(--text) mb-1">
            Sign in
          </h1>
          <p className="text-[12px] text-(--text3) mb-6">
            Welcome back to your workspace
          </p>

          {/* OAuth buttons */}
          <div className="flex flex-col gap-2 mb-5">
            <button
              onClick={() => handleOAuth("github")}
              className="flex items-center justify-center gap-2 h-9 w-full rounded-(--radius) border border-(--border2) bg-(--bg2) text-(--text) font-mono text-[12px] cursor-pointer hover:bg-(--bg3) transition-colors"
            >
              <span>
                <FaGithub />
              </span>{" "}
              Continue with GitHub
            </button>
            <button
              onClick={() => handleOAuth("google")}
              className="flex items-center justify-center gap-2 h-9 w-full rounded-(--radius) border border-(--border2) bg-(--bg2) text-(--text) font-mono text-[12px] cursor-pointer hover:bg-(--bg3) transition-colors"
            >
              <span>
                <FcGoogle />
              </span>{" "}
              Continue with Google
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-2.5 mb-5">
            <div className="flex-1 h-px bg-(--border)" />
            <span className="font-mono text-[10px] text-(--text3)">or</span>
            <div className="flex-1 h-px bg-(--border)" />
          </div>

          {/* Email + password */}
          <div className="flex flex-col gap-2.5">
            <div>
              <label className="font-mono text-[10px] uppercase tracking-[0.08em] text-(--text3) mb-1 block">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="george@devboard.app"
                className="w-full bg-(--bg2) border border-(--border) rounded-(--radius) px-2.5 py-1.75 text-[12.5px] text-(--text) placeholder:text-(--text3) outline-none focus:border-(--accent) transition-colors"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-[0.08em] text-(--text3) mb-1 block">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="••••••••"
                className="w-full bg-(--bg2) border border-(--border) rounded-(--radius) px-2.5 py-1.75 text-[12.5px] text-(--text) placeholder:text-(--text3) outline-none focus:border-(--accent) transition-colors"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="font-mono text-[11px] text-(--red)">{error}</p>
            )}

            <button
              onClick={handleLogin}
              disabled={loading || !email || !password}
              className="brand-gradient h-9 w-full rounded-(--radius) text-white font-mono text-[12px] font-medium cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed mt-1"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </div>

        <p className="text-center font-mono text-[11px] text-(--text3) mt-5">
          Don&apos;t have an account?{" "}
          <span className="text-(--accent) cursor-pointer hover:opacity-70">
            Contact your admin
          </span>
        </p>
      </div>
    </div>
  );
}
