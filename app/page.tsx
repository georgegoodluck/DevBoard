import { redirect } from "next/navigation";

// Root path has no UI of its own — middleware.ts (added in step 1.6) sends
// unauthenticated visitors to /login and everyone else to /overview before
// this ever renders. This redirect is just the fallback if middleware
// somehow doesn't run.
export default function RootPage() {
  redirect("/login");
}
