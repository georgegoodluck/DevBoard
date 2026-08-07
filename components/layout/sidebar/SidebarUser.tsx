"use client";

import Avatar from "@/components/ui/Avatar";
import { useSidebar } from "@/context/SidebarContext";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Props = {
  collapsed: boolean;
  user: { name: string; email: string; initials: string } | null;
};

export default function SidebarUser({ collapsed, user }: Props) {
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const name = user?.name ?? "User";
  const initials = user?.initials ?? "??";

  return (
    <div className="border-t border-(--border) p-[10px_6px]">
      <div
        onClick={handleSignOut}
        title="Sign out"
        className="flex items-center gap-2.25 px-2.5 py-2 rounded-(--radius) cursor-pointer transition-colors hover:bg-(--bg3)"
      >
        <Avatar
          initials={initials}
          gradient="linear-gradient(135deg, #8b5cf6, #06b6d4)"
          size={26}
        />
        {!collapsed && (
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-[12px] font-medium text-(--text) truncate">
              {name}
            </span>
            <span className="font-mono text-[10px] text-(--text3)">admin</span>
          </div>
        )}
        {!collapsed && (
          <div
            className="w-1.75 h-1.75 rounded-full bg-(--green) shrink-0"
            style={{ boxShadow: "0 0 6px var(--green)" }}
          />
        )}
      </div>
    </div>
  );
}
