import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Sidebar from "@/components/layout/sidebar/Sidebar";
import Topbar from "@/components/layout/topbar/Topbar";
import BottomNav from "@/components/layout/mobile/BottomNav";
import CommandPalette from "@/components/ui/CommandPalette";
import NewTaskModal from "@/components/ui/NewTaskModal";
import { CommandPaletteProvider } from "@/context/CommandPaletteContext";
import { NewTaskProvider } from "@/context/NewTaskContext";
import { SidebarProvider } from "@/context/SidebarContext";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Check if user has a workspace
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/workspaces/me`,
    {
      headers: { Authorization: `Bearer ${session?.access_token}` },
      cache: "no-store",
    },
  );

  if (!res.ok) {
    const data = await res.json();
    if (data.code === "NO_WORKSPACE") redirect("/onboarding");
    redirect("/login");
  }

  // Keep this for workspace validation, but the components will fetch their own data
  const { workspace } = await res.json();

  return (
    <CommandPaletteProvider>
      <NewTaskProvider>
        <SidebarProvider>
          <div className="flex h-screen overflow-hidden bg-[var(--bg)]">
            {/* Sidebar — hidden on mobile, visible lg+ */}
            <div className="hidden lg:block">
              <Sidebar />
            </div>

            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
              <Topbar />
              <main className="flex-1 overflow-y-auto p-3 lg:p-5 pb-18 lg:pb-5">
                {children}
              </main>
            </div>
          </div>

          {/* Bottom nav — mobile only */}
          <div className="lg:hidden">
            <BottomNav />
          </div>

          <CommandPalette />
          <NewTaskModal />
        </SidebarProvider>
      </NewTaskProvider>
    </CommandPaletteProvider>
  );
}
