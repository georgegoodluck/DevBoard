import Image from "next/image";
import Link from "next/link";

export default function VerifyPage() {
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
          <div className="text-[36px] mb-[16px]">📬</div>
          <h1 className="font-mono text-[15px] font-semibold text-[var(--text)] mb-[8px]">
            Check your email
          </h1>
          <p className="text-[12px] text-[var(--text3)] leading-relaxed mb-[24px]">
            We sent a confirmation link to your email address. Click it to
            verify your account and set up your workspace.
          </p>
          <Link
            href="/login"
            className="font-mono text-[11px] text-[var(--accent)] hover:opacity-70"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
