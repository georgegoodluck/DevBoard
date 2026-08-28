import { createClient } from "@/lib/supabase/client";

const BASE_URL =
  process.env.NEXT_PUBLIC_USE_MOCK === "true"
    ? ""
    : (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001");

async function fetcher<T>(path: string, options?: RequestInit): Promise<T> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(session?.access_token
        ? { Authorization: `Bearer ${session.access_token}` }
        : {}),
      ...options?.headers,
    },
  });

  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export default fetcher;
