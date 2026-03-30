import Image from "next/image";

export default function SidebarLogo() {
  return (
    <div
      className="flex items-center gap-2 px-4 border-b border-(--border) shrink-0"
      style={{ height: "var(--topbar-height)" }}
    >
      <Image
        src="/icon.svg"
        alt="DevBoard"
        width={22}
        height={22}
        className="shrink-0"
      />
      <span className="font-mono text-[13px] font-semibold tracking-tight">
        <span className="text-(--text)">Dev</span>
        <span className="brand-gradient-text">Board</span>
      </span>
    </div>
  );
}
