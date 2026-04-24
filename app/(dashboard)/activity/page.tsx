"use client";

import { useState } from "react";
import CicdStatus from "@/components/activity/CicdStatus";
import ContributionsPanel from "@/components/activity/ContributionsPanel";
import ActivityFeed from "@/components/activity/ActivityFeed";
import ActivityHeader from "@/components/activity/ActivityHeader";

type Tab = "all" | "commits" | "tasks" | "comments"; // ✅ Fixed to match ActivityHeader

export default function ActivityPage() {
  const [activeTab, setActiveTab] = useState<Tab>("all");

  return (
    <div>
      <ActivityHeader activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="grid grid-cols-[1fr_300px] gap-2.5">
        <ActivityFeed activeTab={activeTab} /> {/* ✅ Pass activeTab */}
        <div className="flex flex-col gap-2.5">
          <ContributionsPanel />
          <CicdStatus />
        </div>
      </div>
    </div>
  );
}
