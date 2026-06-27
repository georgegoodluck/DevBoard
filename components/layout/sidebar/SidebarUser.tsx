import Avatar from "@/components/ui/Avatar";

export default function SidebarUser({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="border-t border-(--border) p-[10px_6px]">
      <div className="flex items-center gap-2.25 px-2.5 py-2 rounded-(--radius) cursor-pointer transition-colors hover:bg-(--bg3)">
        {/* Avatar */}
        <Avatar
          initials="GG"
          gradient="linear-gradient(135deg, #8b5cf6, #06b6d4)"
          size={26}
        />

        {/* Name + role */}
        {!collapsed && ( // ✅ Fixed spelling
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-[12px] font-medium text-[var(--text)] truncate">
              George E.
            </span>
            <span className="font-mono text-[10px] text-[var(--text3)]">
              admin
            </span>
          </div>
        )}

        {/* Online dot */}
        {!collapsed && ( // ✅ Fixed spelling
          <div
            className="w-1.75 h-1.75 rounded-full bg-(--green) shrink-0"
            style={{ boxShadow: "0 0 6px var(--green)" }}
          />
        )}
      </div>
    </div>
  );
}
