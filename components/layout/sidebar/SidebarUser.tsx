export default function SidebarUser() {
  return (
    <div className="border-t border-(--border) p-[10px_6px]">
      <div className="flex items-center gap-2.25 px-2.5 py-2 rounded-(--radius) cursor-pointer transition-colors hover:bg-[var(--bg3)]">
        {/* Avatar */}
        <div
          className="flex items-center justify-center w-6.5 h-6.5 rounded-full font-mono text-[10px] font-semibold text-white shrink-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(2, 0, 36, 1) 0%, rgba(9, 9, 121, 1) 11%, rgba(0, 212, 255, 1) 100%);",
          }}
        >
          GG
        </div>

        {/* Name + role */}
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-[12px] font-medium text-(--text) truncate">
            George G.
          </span>
          <span className="font-mono text-[10px] text-(--text3)">
            admin
          </span>
        </div>

        {/* Online dot */}
        <div
          className="w-1.75 h-1.75 rounded-full bg-(--green) shrink-0"
          style={{ boxShadow: "0 0 6px var(--green)" }}
        />
      </div>
    </div>
  );
}
