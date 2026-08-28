"use client";

import { useActivity } from "@/hooks/useActivity";
import CardHeader from "@/components/ui/CardHeader";
import ActivityItem from "./ActivityItem";

type Tab = "all" | "commits" | "tasks" | "comments";

type Props = {
  activeTab?: Tab;
};

export default function ActivityFeed({ activeTab = "all" }: Props) {
  const { data: events, isLoading, isError } = useActivity();

  const filtered =
    events?.filter((e) => {
      if (activeTab === "all") return true;
      if (activeTab === "commits") return e.type === "merge";
      if (activeTab === "tasks") return e.type === "task";
      if (activeTab === "comments") return e.type === "comment";
      return true;
    }) ?? [];

  return (
    <div className="bg-[var(--bg1)] border border-[var(--border)] rounded-[6px] overflow-hidden">
      <CardHeader
        title="Activity Feed"
        dotColor="var(--accent)"
        right={
          <span className="font-mono text-[10px] text-[var(--text3)]">
            {events ? `Today · ${events.length} events` : ""}
          </span>
        }
      />
      <div>
        {isLoading && (
          <div className="px-[14px] py-[32px] text-center font-mono text-[11px] text-[var(--text3)]">
            Loading...
          </div>
        )}
        {isError && (
          <div className="px-[14px] py-[32px] text-center font-mono text-[11px] text-[var(--red)]">
            Failed to load activity.
          </div>
        )}
        {!isLoading && !isError && filtered.length === 0 && (
          <div className="px-[14px] py-[32px] text-center font-mono text-[11px] text-[var(--text3)]">
            No activity yet.
          </div>
        )}
        {filtered.map((e) => (
          <ActivityItem key={e.id} event={e} />
        ))}
      </div>
    </div>
  );
}
