import TopbarBreadcrumb from "./TopbarBreadcrumb";

export default function Topbar() {
  return (
    <header className="p-2 bg-[var(--bg1)]" 
    style={{ height: "var(--topbar-height)" }}>
      <TopbarBreadcrumb />
    </header>
  );
}
