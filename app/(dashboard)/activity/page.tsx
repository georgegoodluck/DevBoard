import CicdStatus from "@/components/activity/CicdStatus";
import ContributionsPanel from "@/components/activity/ContributionsPanel";
import ActivityFeed from "@/components/activity/ActivityFeed";

export default function ActivityPage() {
  return (
    <div className="grid grid-cols-[1fr_300px] gap-2.5">
      <ActivityFeed />
      <div className="flex flex-col gap-2.5">
        <ContributionsPanel />
        <CicdStatus />
      </div>
    </div>
  );
}
