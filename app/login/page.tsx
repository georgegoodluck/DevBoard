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
    <div>
      <div className="w-full max-w-95">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <Image src="/logo.svg" alt="DevBoard" width={28} height={28} />
          <span>
            <span>Dev</span>
            <span>Board</span>
          </span>
        </div>
      </div>
    </div>
  );
}
