import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/layout/sidebar/Sidebar";
import { Topbar } from "@/components/layout/topbar/Topbar";
import { SidebarProvider } from "@/context/SidebarContext";
import { CommandPaletteProvider } from "@/context/CommandPaletteContext";
import { NewTaskProvider } from "@/context/NewTaskContext";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { NewTaskModal } from "@/components/ui/NewTaskModal";
import { EnsureWorkspaceCookie } from "./EnsureWorkspaceCookie";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Middleware already redirected unauthenticated visitors away, but that
  // check is cookie-based and can be a request stale — confirm here with a
  // real call to the backend, which is the actual source of truth.
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/workspaces/me`,
    {
      headers: { Authorization: `Bearer ${session?.access_token}` },
      cache: "no-store",
    },
  );

  if (res.status === 403) {
    redirect("/onboarding");
  }
  if (!res.ok) {
    redirect("/login");
  }

  return (
    <SidebarProvider>
      <CommandPaletteProvider>
        <NewTaskProvider>
          <EnsureWorkspaceCookie />
          <div className="flex h-screen overflow-hidden bg-bg">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
              <Topbar />
              <main className="flex-1 overflow-y-auto p-6">{children}</main>
            </div>
          </div>
          <CommandPalette />
          <NewTaskModal />
        </NewTaskProvider>
      </CommandPaletteProvider>
    </SidebarProvider>
  );
}
