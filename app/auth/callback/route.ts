import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const origin = req.nextUrl.origin;
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Forward request headers / preserve cookies across redirect
      const forwardedHost = req.headers.get("x-forwarded-host");
      const isDev = process.env.NODE_ENV === "development";

      if (isDev) {
        return NextResponse.redirect(`${origin}/overview`);
      } else {
        const redirectUrl = forwardedHost
          ? `https://${forwardedHost}/overview`
          : `${origin}/overview`;
        return NextResponse.redirect(redirectUrl);
      }
    }

    console.error("Google Auth Exchange Error:", error.message);
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
