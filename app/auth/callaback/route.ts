import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.session) {
    return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
  }

  const workspaceRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/workspaces/me`,
    {
      headers: { Authorization: `Bearer ${data.session.access_token}` },
    },
  );

  const destination = workspaceRes.ok ? "/overview" : "/onboarding";
  const response = NextResponse.redirect(`${origin}${destination}`);

  if (workspaceRes.ok) {
    response.cookies.set("devboard_has_workspace", "1", {
      path: "/",
      maxAge: 31536000,
    });
  }

  return response;
}
