export default function SidebarUser() {
  return (
    <div className="border-t border-[var(--border)] p-[10px_6px]">
      <div className="flex items-center gap-[9px] px-[10px] py-2 rounded-[var(--radius)] cursor-pointer transition-colors hover:bg-[var(--bg3)]">
        {/* Avatar */}
        <div
          className="flex items-center justify-center w-[26px] h-[26px] rounded-full font-mono text-[10px] font-semibold text-white shrink-0"
          style={{ background: "linear-gradient(135deg, #4f8eff, #a78bfa)" }}
        >
          GG
        </div>

        {/* Name + role */}
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-[12px] font-medium text-[var(--text)] truncate">
            George G.
          </span>
          <span className="font-mono text-[10px] text-[var(--text3)]">
            admin
          </span>
        </div>

        {/* Online dot */}
        <div
          className="w-[7px] h-[7px] rounded-full bg-[var(--green)] shrink-0"
          style={{ boxShadow: "0 0 6px var(--green)" }}
        />
      </div>
    </div>
  );
}
