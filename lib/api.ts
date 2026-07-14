async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export default fetcher;
// Shared fetcher because every hook needs to fetch, check for errors, and parse JSON. Centralising it means error handling is consistent and you only change it in one place when you add auth headers later.
