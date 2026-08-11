"use client";

import { useActivity } from "@/hooks/useActivity";
import CardHeader from "@/components/ui/CardHeader";
import ActivityItem from "./ActivityItem";
import { mockActivity } from "@/mocks/data/activity";
import type { ActivityEvent } from "@/types/activity";

type Tab = "all" | "commits" | "tasks" | "comments";

type Props = {
  activeTab?: Tab;
};

// Filter function based on tab
const filterEventsByTab = (
  events: ActivityEvent[],
  tab: Tab,
): ActivityEvent[] => {
  if (tab === "all") return events;

  switch (tab) {
    case "commits":
      return events.filter(
        (e) => e.type === "merge" || e.action?.includes("commit"),
      );
    case "tasks":
      return events.filter((e) => e.type === "task");
    case "comments":
      return events.filter((e) => e.type === "comment");
    default:
      return events;
  }
};

export default function ActivityFeed({ activeTab = "all" }: Props) {
  const { data: apiEvents, isLoading, isError } = useActivity();

  // Use API data if available, otherwise fallback to mock
  const events = apiEvents?.length ? apiEvents : mockActivity;
  const filteredEvents = filterEventsByTab(events, activeTab);

  // Get the display name for the tab
  const tabDisplayName =
    activeTab === "all"
      ? "Today"
      : activeTab.charAt(0).toUpperCase() + activeTab.slice(1);

  return (
    <div className="bg-(--bg1) border border-(--border) rounded-(--radius) overflow-hidden">
      <CardHeader
        title="Activity Feed"
        dotColor="var(--accent)"
        right={
          <span className="font-mono text-[10px] text-(--text3)">
            {isLoading
              ? "Loading..."
              : `${tabDisplayName} • ${filteredEvents.length} events`}
          </span>
        }
      />

      <div>
        {isLoading && (
          <div className="px-3.5 py-8 text-center font-mono text-[11px] text-(--text3)">
            Loading activity...
          </div>
        )}

        {isError && !apiEvents?.length && (
          <div className="px-3.5 py-8 text-center font-mono text-[11px] text-(--red)">
            Failed to load activity. Showing cached data.
          </div>
        )}

        {!isLoading && filteredEvents.length === 0 && (
          <div className="px-3.5 py-8 text-center font-mono text-[11px] text-(--text3)">
            No {activeTab !== "all" ? activeTab : ""} events found
          </div>
        )}

        {!isLoading && filteredEvents.length > 0 && (
          filteredEvents.map((e) => <ActivityItem key={e.id} event={e} />)
        )}
      </div>
    </div>
  );
}