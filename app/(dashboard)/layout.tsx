import Sidebar from "@/components/layout/sidebar/Sidebar";
import Topbar from "@/components/layout/topbar/Topbar";
import BottomNav from "@/components/layout/mobile/BottomNav";
import CommandPalette from "@/components/ui/CommandPalette";
import { CommandPaletteProvider } from "@/context/CommandPaletteContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CommandPaletteProvider>
      <div className="flex h-screen overflow-hidden bg-(--bg)">
        {/* Sidebar - hidden on mobile, visible lg */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-y-auto p-5 pb-20 lg:pb-5">
            {children}
          </main>
        </div>

        {/* BottomNav - visible on mobile display */}
        <div className="lg:hidden">
          <BottomNav />
        </div>
      </div>
      <CommandPalette />
    </CommandPaletteProvider>
  );
}
