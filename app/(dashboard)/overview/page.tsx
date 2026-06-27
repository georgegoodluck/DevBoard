import StatCardGrid from "@/components/overview/StatCardGrid";
import ActiveProjects from "@/components/overview/ActiveProjects";
import RecentTasks from "@/components/overview/RecentTasks";
import SprintVelocity from "@/components/overview/SprintVelocity";
import TeamPanel from "@/components/overview/TeamPanel";
import Deadlines from "@/components/overview/Deadlines";

export default function OverviewPage() {
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
