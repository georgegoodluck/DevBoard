import StatCardGrid from "@/components/overview/StatCardGrid";
import ActiveProjects from "@/components/overview/ActiveProjects";
import RecentTasks from "@/components/overview/RecentTasks";
import SprintVelocity from "@/components/overview/SprintVelocity";
import TeamPanel from "@/components/overview/TeamPanel";
import Deadlines from "@/components/overview/Deadlines";

export default function OverviewPage() {
  return (
    <div className="flex flex-col gap-2">
      <StatCardGrid />

      {/* Two Column Layout */}
      <div className="flex gap-2.5">
        {/* Left Column */}
        <div className="flex-1 flex flex-col gap-2">
          <ActiveProjects />
          <RecentTasks />
        </div>

        <div className="flex flex-col gap-2 w-80">
          <SprintVelocity />
          <TeamPanel />
          <Deadlines />
        </div>
      </div>
    </div>
  );
}
