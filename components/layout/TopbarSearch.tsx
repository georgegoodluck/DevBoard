import { Search } from "lucide-react";

export default function TopbarSearch() {
  return (
    <div className="flex items-center gap-3 px-3 border bg-[var(--bg2)] border-[var(--border)] rounded-[var(--radius)] h-[30px] w-[180px] cursor-text">
      <Search size={14} />
      <span className="font-mono">Search...</span>
      <kbd className="bg-[var(--bg3)] border-[var(--border)] rounded-[var(--radius)] px-[5px] py-[2px] ml-auto">
        &#x2318;k
      </kbd>
    </div>
  );
}
