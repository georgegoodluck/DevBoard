const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

async function fetcher<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export default fetcher;
// Shared fetcher because every hook needs to fetch, check for errors, and parse JSON. Centralizing it means error handling is consistent and you only change it in one place when you add auth headers later.
