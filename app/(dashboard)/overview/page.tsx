import StatGrid from "@/components/layout/overview/StatGrid";
import ActiveProjects from "@/components/layout/overview/ActiveProjects";
import RecentTasks from "@/components/layout/overview/RecentTasks";

export default function OverviewPage() {
  return (
    <div>
      <StatGrid />
      <ActiveProjects />
      <RecentTasks />
    </div>
  );
}
