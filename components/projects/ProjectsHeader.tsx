"use client";

import { Plus } from "lucide-react";

type Tab = "all" | "active" | "archived";

type Props = {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
};

const tabs: { label: string; value: Tab }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Archived", value: "archived" },
];

export default function ProjectsHeader({ activeTab, onTabChange }: Props) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      {/* Tabs */}
      <div className="flex gap-0.5 p-1 bg-(--bg2) border border-(--border) rounded-[5px]">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={`px-8 py-1.25 rounded-[3px] font-mono text-[11px] font-medium cursor-pointer transition-all ${
              activeTab === tab.value
                ? "bg-(--bg1) text-(--text) shadow-sm"
                : "text-(--text3) hover:text-(--text)"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="ml-auto flex items-center gap-2">
        <button className="flex items-center gap-1.5 h-7 px-2.5 rounded-(--radius) border border-(--border2) bg-(--bg2) text-(--text2) font-mono text-[11px] cursor-pointer hover:bg-(--bg3) hover:text-(--text) transition-colors">
          Filter
        </button>
        <button className="brand-gradient flex items-center gap-1.5 h-7 px-2.5 rounded-(--radius) text-white font-mono text-[11px] cursor-pointer transition-opacity hover:opacity-90">
          <Plus size={12} />
          New Project
        </button>
      </div>
    </div>
  );
}
