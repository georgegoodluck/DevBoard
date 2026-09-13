"use client";

import Link from "next/link";
import { StatCardGrid } from "@/components/overview/StatCardGrid";
// import { ActiveProjects } from "@/components/overview/ActiveProjects";
// import { RecentTasks } from "@/components/overview/RecentTasks";
// import { SprintVelocity } from "@/components/overview/SprintVelocity";
// import { TeamPanel } from "@/components/overview/TeamPanel";
// import { Deadlines } from "@/components/overview/Deadlines";
import { EmptyState } from "@/components/ui/EmptyState";
import { useProjects } from "@/hooks/useProjects";
import { LayoutDashboard, Plus } from "lucide-react";

export default function OverviewPage() {
  const { data: projects, isLoading } = useProjects();

  if (!isLoading && (projects ?? []).length === 0) {
    return (
      <EmptyState
        icon={LayoutDashboard}
        title="Welcome to your workspace"
        description="Create your first project to start tracking work."
        action={
          <Link
            href="/projects"
            className="mt-2 inline-flex items-center gap-1.5 rounded-devboard px-4 py-2 text-sm font-medium text-white brand-gradient"
          >
            <Plus className="h-4 w-4" />
            Create a project
          </Link>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <StatCardGrid />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* <ActiveProjects />
          <RecentTasks />
          <SprintVelocity /> */}
        </div>
        <div className="flex flex-col gap-6">
          {/* <TeamPanel />
          <Deadlines /> */}
        </div>
      </div>
    </div>
  );
}
