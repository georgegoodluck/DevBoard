import ActivityFeed from "@/components/activity/ActivityFeed";
import ContributionsPanel from "@/components/activity/ContributionsPanel";

export default function ActivityPage() {
  return (
    <div className="grid grid-cols-[1fr_300px] gap-2.5">
      <ActivityFeed />
      <div className="flex flex-col">
        <ContributionsPanel />
      </div>
    </div>
  );
}
