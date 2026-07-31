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
  const [loading, setLoading] = useState("");

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
          <p className="text-[12px] text-(--text3) mb-[24px]">
            Welcome back to your workspace
          </p>
        </div>
      </div>
    </div>
  );
}
