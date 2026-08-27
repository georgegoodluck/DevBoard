import StatCardGrid from "@/components/overview/StatCardGrid";
import ActiveProjects from "@/components/overview/ActiveProjects";
import RecentTasks from "@/components/overview/RecentTasks";
import SprintVelocity from "@/components/overview/SprintVelocity";
import TeamPanel from "@/components/overview/TeamPanel";
import Deadlines from "@/components/overview/Deadlines";
import EmptyState from "@/components/ui/EmptyState";
import { LayoutGrid } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function OverviewPage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Fetch data just to check if workspace is empty
  const headers = { Authorization: `Bearer ${session?.access_token}` };
  const base = process.env.NEXT_PUBLIC_API_URL;

  const [projectsRes, tasksRes] = await Promise.all([
    fetch(`${base}/api/projects`, { headers, cache: "no-store" }),
    fetch(`${base}/api/tasks`, { headers, cache: "no-store" }),
  ]);

  const projects = await projectsRes.json();
  const tasks = await tasksRes.json();

  const isEmpty = projects.length === 0 && tasks.length === 0;

  if (isEmpty) {
    return (
      <div className="flex items-center justify-center h-full">
        <EmptyState
          icon={LayoutGrid}
          title="Your workspace is empty"
          description="Create your first project to get started. Invite your team to collaborate."
          action={{ label: "+ New Project" }}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      <StatCardGrid />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-2.5">
        {/* Left Column */}
        <div className="flex flex-col gap-2">
          <ActiveProjects />
          <RecentTasks />
        </div>

        {/* Right - Full width on mobile, sidebar on desktop */}
        <div className="flex flex-col gap-2.5">
          <SprintVelocity />
          <TeamPanel />
          <Deadlines />
        </div>
      </div>
    </div>
  );
}
