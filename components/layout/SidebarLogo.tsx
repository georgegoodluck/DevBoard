import { LayoutDashboard } from "lucide-react";

export default function SidebarLogo() {
  return (
    <div
      style={{
        padding: "0 16px",
        height: "var(--topbar-height)",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        borderBottom: "1px solid var(--border)",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: "22px",
          height: "22px",
          background: "var(--accent)",
          borderRadius: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LayoutDashboard size={13} color="white" />
      </div>
      <span
        style={{
          fontFamily: "IBM Plex Mono, monospace",
          fontSize: "13px",
          fontWeight: 600,
          color: "var(--text)",
          letterSpacing: "-0.02em",
        }}
      >
        Dev<span style={{ color: "var(--accent)" }}>Board</span>
      </span>
    </div>
  );
}
