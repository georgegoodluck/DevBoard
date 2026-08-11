import Sidebar from "@/components/layout/sidebar/Sidebar";
import Topbar from "@/components/layout/topbar/Topbar";
import BottomNav from "@/components/layout/mobile/BottomNav";
import CommandPalette from "@/components/ui/CommandPalette";
import NewTaskModal from "@/components/ui/NewTaskModal";
import { CommandPaletteProvider } from "@/context/CommandPaletteContext";
import { NewTaskProvider } from "@/context/NewTaskContext";
import { SidebarProvider } from "@/context/SidebarContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CommandPaletteProvider>
      <NewTaskProvider>
        <SidebarProvider>
          <div className="flex h-screen overflow-hidden bg-(--bg)">

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