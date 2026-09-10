import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const PUBLIC_PATHS = ["/login", "/register", "/register/verify", "/invite", "/auth/callback"];

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request);
  const path = request.nextUrl.pathname;
  const isPublic = PUBLIC_PATHS.some((p) => path === p || path.startsWith(p + "/"));

  if (!user && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Onboarding gate: does this user belong to a workspace yet? We can't
  // hit our own Fastify API from middleware without adding latency to
  // every request, so this checks a lightweight cookie set by the
  // onboarding flow and by the dashboard layout on first successful load
  // (see app/(dashboard)/layout.tsx in step 1.9) rather than calling
  // /api/workspaces/me here.
  const hasWorkspace = request.cookies.get("devboard_has_workspace")?.value === "1";
  if (user && !hasWorkspace && path !== "/onboarding" && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/onboarding";
    return NextResponse.redirect(url);
  }

  if (user && path === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = hasWorkspace ? "/overview" : "/onboarding";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
