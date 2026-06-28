"use client";

type Tab = "all" | "commits" | "tasks" | "comments";

type Props = {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
};

const tabs: { label: string; value: Tab }[] = [
  { label: "All", value: "all" },
  { label: "Commits", value: "commits" },
  { label: "Tasks", value: "tasks" },
  { label: "Comments", value: "comments" },
];

export default function ActivityHeader({ activeTab, onTabChange }: Props) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-stretch gap-2 p-[10px_14px]">
      {/* Tabs */}
      <div className="flex gap-0.5 p-1 bg-(--bg2) border border-(--border) rounded-[5px]">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={`flex-1 px-4 py-1 rounded-[3px] font-mono text-[11px] font-medium cursor-pointer transition-all ${
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
      {/* <div className="sm:ml-auto flex items-center gap-2"> */}
      <button className="sm:ml-auto h-[28px] px-[10px] rounded-[var(--radius)] border border-[var(--border2)] bg-[var(--bg2)] text-[var(--text2)] font-mono text-[11px] cursor-pointer hover:bg-[var(--bg3)] hover:text-[var(--text)] transition-colors">
        Filter by project
      </button>
      {/* </div> */}
    </div>
  );
}
