"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [memberName, setMemberName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const createWorkspace = useMutation({
    mutationFn: () => api.post("/api/workspaces", { name, slug, memberName }),
    onSuccess: () => {
      document.cookie = "devboard_has_workspace=1; path=/; max-age=31536000";
      setStep(2);
    },
    onError: (e: any) => setError(e.message ?? "Something went wrong"),
  });

  const sendInvite = useMutation({
    mutationFn: () =>
      api.post("/api/workspaces/invite", {
        email: inviteEmail,
        role: "member",
      }),
    onSuccess: () => setInviteEmail(""),
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-md rounded-devboard border border-border bg-bg1 p-6">
        <div className="mb-5 flex gap-2">
          <div
            className={`h-1 flex-1 rounded-full ${step >= 1 ? "brand-gradient" : "bg-bg3"}`}
          />
          <div
            className={`h-1 flex-1 rounded-full ${step >= 2 ? "brand-gradient" : "bg-bg3"}`}
          />
        </div>

        {step === 1 ? (
          <>
            <h1 className="text-lg font-semibold">Create your workspace</h1>
            <p className="mt-1 text-sm text-text2">
              This is where your whole team will collaborate.
            </p>

            <form
              className="mt-6 flex flex-col gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                setError(null);
                createWorkspace.mutate();
              }}
            >
              <input
                required
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                placeholder="Your name"
                className="rounded-devboard border border-border bg-bg1 px-3 py-2 text-sm outline-none focus:border-accent"
              />
              <input
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setSlug(
                    e.target.value
                      .toLowerCase()
                      .trim()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/(^-|-$)/g, ""),
                  );
                }}
                placeholder="Workspace name (e.g. Acme Team)"
                className="rounded-devboard border border-border bg-bg1 px-3 py-2 text-sm outline-none focus:border-accent"
              />
              <div className="flex items-center rounded-devboard border border-border bg-bg1 px-3 py-2 text-sm text-text2">
                devboard.app/
                <input
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="flex-1 bg-transparent text-text outline-none"
                />
              </div>
              {error && <p className="text-xs text-red">{error}</p>}
              <button
                type="submit"
                disabled={createWorkspace.isPending}
                className="rounded-devboard py-2 text-sm font-medium text-white brand-gradient disabled:opacity-50"
              >
                {createWorkspace.isPending ? "Creating…" : "Continue"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-lg font-semibold">Invite your team</h1>
            <p className="mt-1 text-sm text-text2">
              Add teammates now, or skip and do it later from Settings.
            </p>

            <form
              className="mt-6 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (inviteEmail.trim()) sendInvite.mutate();
              }}
            >
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="teammate@company.com"
                className="flex-1 rounded-devboard border border-border bg-bg1 px-3 py-2 text-sm outline-none focus:border-accent"
              />
              <button
                type="submit"
                disabled={sendInvite.isPending}
                className="rounded-devboard border border-border2 bg-bg2 px-4 text-sm font-medium hover:bg-bg3 disabled:opacity-50"
              >
                Invite
              </button>
            </form>

            <button
              onClick={() => router.push("/overview")}
              className="mt-5 w-full rounded-devboard py-2 text-sm font-medium text-white brand-gradient"
            >
              Go to dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
}
