import StatGrid from "@/components/layout/overview/StatGrid";
import ActiveProjects from "@/components/layout/overview/ActiveProjects";
import RecentTasks from "@/components/layout/overview/RecentTasks";
import SprintVelocity from "@/components/layout/overview/SprintVelocity";

export default function OverviewPage() {
  return (
    <div className="flex flex-col gap-2">
      <StatGrid />
      {/* Two Column Layout */}
      <div className="flex gap-2.5">
        {/* Left Column */}
        <div className="flex-1">
          <div className="flex-1">
            <ActiveProjects />
          </div>
          <RecentTasks />
        </div>

        <div className="flex flex-col w-80">
        <SprintVelocity />
        </div>
      </div>
    </div>
  );
}
