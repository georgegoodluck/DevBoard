"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!form.name || !form.email || !form.password) return;
    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: form.name },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Supabase sends a confirmation email
    // Redirect to a "check your email" screen
    router.push("/register/verify");
  }

  async function handleOAuth(provider: "github" | "google") {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { next: "/onboarding" },
      },
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
            Create your account
          </h1>
          <p className="text-[12px] text-[var(--text3)] mb-[24px]">
            Set up your team workspace in minutes
          </p>

          {/* OAuth */}
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

          {/* Fields */}
          <div className="flex flex-col gap-[10px]">
            {[
              {
                label: "Full name",
                key: "name",
                type: "text",
                placeholder: "George Goodluck",
              },
              {
                label: "Email",
                key: "email",
                type: "email",
                placeholder: "george@company.com",
              },
              {
                label: "Password",
                key: "password",
                type: "password",
                placeholder: "Min. 8 characters",
              },
              {
                label: "Confirm password",
                key: "confirm",
                type: "password",
                placeholder: "••••••••",
              },
            ].map((field) => (
              <div key={field.key}>
                <label className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--text3)] mb-[4px] block">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  value={form[field.key as keyof typeof form]}
                  onChange={(e) =>
                    setForm({ ...form, [field.key]: e.target.value })
                  }
                  onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                  className="w-full bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--radius)] px-[10px] py-[7px] text-[12.5px] text-[var(--text)] placeholder:text-[var(--text3)] outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>
            ))}

            {error && (
              <p className="font-mono text-[11px] text-[var(--red)]">{error}</p>
            )}

            <button
              onClick={handleRegister}
              disabled={loading || !form.name || !form.email || !form.password}
              className="brand-gradient h-[36px] w-full rounded-[var(--radius)] text-white font-mono text-[12px] font-medium cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed mt-[4px]"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </div>
        </div>

        <p className="text-center font-mono text-[11px] text-[var(--text3)] mt-[20px]">
          Already have an account?{" "}
          <Link href="/login" className="text-[var(--accent)] hover:opacity-70">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
