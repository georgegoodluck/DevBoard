import { createClient } from "@/lib/supabase/client";
import SidebarClient from "./SidebarClient";

export default async function Sidebar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userData = user
    ? {
        name: user.user_metadata?.full_name ?? user.email ?? "User",
        email: user.email ?? "",
        initials:
          (user.user_metadata?.full_name as string)
            ?.split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2) ?? "U",
      }
    : null;
  return <SidebarClient user={userData} />;
}
