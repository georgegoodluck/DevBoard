import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Reads all cookies from the incoming request so supabase can read the session auth token(JWT)
        getAll() {
          return cookieStore.getAll();
        },
        // Allows supabase to automatically refresh expired auth tokens and write updated session cookies back to the response headers
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set({ name, value, ...options });
            });
          } catch {
            // SetAll called from a server component
          }
        },
      },
    },
  );
}
