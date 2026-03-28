import { div } from "framer-motion/client";
import { Plus } from "lucide-react";

export default function TopbarActions() {
  return (
    <div className="flex items-center">
      <button className="border border-[var(--border)] rounded-[var(--radius)] flex items-center gap-2 px-3 h-[30px] text-[var(--text3)] font-mono hover:text-[var(--text1)] hover:bg-[var(--bg2)] cursor-pointer">
        <Plus size={14} />
        New
      </button>
    </div>
  );
}
