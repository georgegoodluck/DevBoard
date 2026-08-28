"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleNameChange(value: string) {
    setName(value);
    if (!slugEdited) setSlug(slugify(value));
  }

  async function handleCreate() {
    if (!name.trim() || !slug.trim()) return;
    setLoading(true);
    setError("");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/workspaces`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ name: name.trim(), slug: slug.trim() }),
        },
      );

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Failed to create workspace");
        setLoading(false);
        return;
      }

      // Workspace created — go to step 2 (invite team)
      setStep(2);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  function handleSkip() {
    router.push("/overview");
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4">
      <div className="w-full max-w-[440px]">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-[40px]">
          <Image src="/icon.svg" alt="DevBoard" width={28} height={28} />
          <span className="font-mono text-[16px] font-semibold tracking-tight">
            <span className="text-[var(--text)]">Dev</span>
            <span className="brand-gradient-text">Board</span>
          </span>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-[8px] justify-center mb-[32px]">
          {[1, 2].map((s) => (
            <div
              key={s}
              className="h-[3px] w-[40px] rounded-full transition-all"
              style={{
                background:
                  s <= step
                    ? "linear-gradient(135deg, #8b5cf6, #06b6d4)"
                    : "var(--border2)",
              }}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="bg-[var(--bg1)] border border-[var(--border)] rounded-[8px] p-[28px]">
            <h1 className="font-mono text-[15px] font-semibold text-[var(--text)] mb-[4px]">
              Create your workspace
            </h1>
            <p className="text-[12px] text-[var(--text3)] mb-[24px]">
              This is where your team&apos;s projects and tasks will live.
            </p>

            <div className="flex flex-col gap-[12px]">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--text3)] mb-[4px] block">
                  Workspace name
                </label>
                <input
                  autoFocus
                  placeholder="Acme Corp"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--radius)] px-[10px] py-[7px] text-[12.5px] text-[var(--text)] placeholder:text-[var(--text3)] outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--text3)] mb-[4px] block">
                  Workspace URL
                </label>
                <div className="flex items-center bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--radius)] overflow-hidden focus-within:border-[var(--accent)] transition-colors">
                  <span className="font-mono text-[11px] text-[var(--text3)] px-[10px] border-r border-[var(--border)] h-full py-[7px] whitespace-nowrap">
                    devboard.app/
                  </span>
                  <input
                    placeholder="acme-corp"
                    value={slug}
                    onChange={(e) => {
                      setSlug(slugify(e.target.value));
                      setSlugEdited(true);
                    }}
                    className="flex-1 bg-transparent px-[10px] py-[7px] text-[12.5px] text-[var(--text)] font-mono placeholder:text-[var(--text3)] outline-none"
                  />
                </div>
              </div>

              {error && (
                <p className="font-mono text-[11px] text-[var(--red)]">
                  {error}
                </p>
              )}

              <button
                onClick={handleCreate}
                disabled={loading || !name.trim() || !slug.trim()}
                className="brand-gradient h-[36px] w-full rounded-[var(--radius)] text-white font-mono text-[12px] font-medium cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed mt-[4px]"
              >
                {loading ? "Creating..." : "Create workspace →"}
              </button>
            </div>
          </div>
        )}

        {step === 2 && <InviteStep onSkip={handleSkip} />}
      </div>
    </div>
  );
}

function InviteStep({ onSkip }: { onSkip: () => void }) {
  const [emails, setEmails] = useState<string[]>(["", "", ""]);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  function updateEmail(index: number, value: string) {
    const updated = [...emails];
    updated[index] = value;
    setEmails(updated);
  }

  async function handleInvite() {
    const validEmails = emails.filter((e) => e.trim() && e.includes("@"));
    if (validEmails.length === 0) {
      onSkip();
      return;
    }

    setSending(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return;

    await Promise.all(
      validEmails.map((email) =>
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/workspaces/invite`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ email }),
        }),
      ),
    );

    setSending(false);
    setSent(true);
    setTimeout(() => router.push("/overview"), 1500);
  }

  return (
    <div className="bg-[var(--bg1)] border border-[var(--border)] rounded-[8px] p-[28px]">
      <h1 className="font-mono text-[15px] font-semibold text-[var(--text)] mb-[4px]">
        Invite your team
      </h1>
      <p className="text-[12px] text-[var(--text3)] mb-[24px]">
        They&apos;ll get an email with a link to join your workspace.
      </p>

      {sent ? (
        <div className="text-center py-[24px]">
          <div className="text-[32px] mb-[8px]">🎉</div>
          <p className="font-mono text-[12px] text-[var(--green)]">
            Invites sent! Taking you to your workspace...
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-[10px]">
          {emails.map((email, i) => (
            <input
              key={i}
              type="email"
              placeholder={`teammate${i + 1}@company.com`}
              value={email}
              onChange={(e) => updateEmail(i, e.target.value)}
              className="w-full bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--radius)] px-[10px] py-[7px] text-[12.5px] text-[var(--text)] placeholder:text-[var(--text3)] outline-none focus:border-[var(--accent)] transition-colors"
            />
          ))}

          <div className="flex gap-[8px] mt-[4px]">
            <button
              onClick={onSkip}
              className="flex-1 h-[36px] rounded-[var(--radius)] border border-[var(--border2)] text-[var(--text2)] font-mono text-[12px] cursor-pointer hover:bg-[var(--bg3)] transition-colors"
            >
              Skip for now
            </button>
            <button
              onClick={handleInvite}
              disabled={sending}
              className="flex-1 brand-gradient h-[36px] rounded-[var(--radius)] text-white font-mono text-[12px] cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              {sending ? "Sending..." : "Send invites →"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
