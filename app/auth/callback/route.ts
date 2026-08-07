import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Exports an async GET function that handles the OAuth callback from Supabase.
// It retrieves the access token and refresh token from the query parameters,
// sets them as cookies, and redirects the user to the overview page.
export async function GET(req: NextRequest) {
  // Parse the incoming request to extract the search parameters and origin.
  const { searchParams } = new URL(req.url);
  const origin = req.nextUrl.origin;

  // Extract the authorization code from the search parameters.
  const code = searchParams.get("code");

  if (code) {
    // Initialize supabase client using the createClient function.
    const supabase = await createClient();
    // Exchange the temporary auth code for an active user session.
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}/overview`);
    }
  }

  // Redirect to login with error if code is missing or exchange failed
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
