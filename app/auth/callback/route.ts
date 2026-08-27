import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/overview";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Forward request headers / preserve cookies across redirect
      const forwardedHost = req.headers.get("x-forwarded-host");
      const isDev = process.env.NODE_ENV === "development";

      if (isDev) {
        return NextResponse.redirect(`${origin}${next}`);
      } else {
        const redirectUrl = forwardedHost
          ? `https://${forwardedHost}${next}`
          : `${origin}${next}`;
        return NextResponse.redirect(redirectUrl);
      }
    }

    console.error("Auth Exchange Error:", error.message);
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
