import { Search } from "lucide-react";

export default function TopbarSearch() {
  return (
    <div className="flex items-center gap-3 px-3 bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--radius)] h-[30px] w-[180px] cursor-text text-[var(--text3)] hover:bg-[var(--bg3)]">
      <Search size={14} />
      <span className="font-mono text-[11px]">Search...</span>
      <kbd className="bg-[var(--bg3)] border border-[var(--border)] rounded-[var(--radius)] text-[10px] px-[5px] py-[2px] ml-auto">
        &#x2318;K
      </kbd>
    </div>
  );
}
