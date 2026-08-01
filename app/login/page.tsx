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
          <p className="text-[12px] text-(--text3) mb-6">
            Welcome back to your workspace
          </p>
        </div>

        {/* OAuth buttons */}
        <div className="flex flex-col gap-2 mb-5">
          <button
            // onClick={() => handleOAuth("github")}
            className="flex items-center justify-center gap-2 h-9 w-full rounded-(--radius) border border-(--border2) bg-(--bg2) text-(--text) font-mono text-[12px] cursor-pointer hover:bg-(--bg3) transition-colors"
          >
            <span>
              <FaGithub size={16} className="text-white" />
            </span>
            Continue with Github
          </button>
          <button
            // onClick={() => handleOAuth("google")}
            className="flex items-center justify-center gap-2 h-9 w-full rounded-(--radius) border border-(--border2) bg-(--bg2) text-(--text) font-mono text-[12px] cursor-pointer hover:bg-(--bg3) transition-colors"
          >
            <span>
              <FcGoogle size={16} />
            </span>
            Continue with Google
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-2.5 mb-5">
          <div className="flex-1 h-px bg-(--border)" />
          <span className="font-mono text-[10px] text-(--text3)">or</span>
          <div className="flex-1 h-px bg-(--border)" />
        </div>
      </div>
    </div>
  );
}
