import TopbarBreadcrumb from "./TopbarBreadcrumb";
import TopbarSearch from "./TopbarSearch";

export default function Topbar() {
  return (
    <header className="flex items-center gap-3 p-2 bg-[var(--bg1)]" 
    style={{ height: "var(--topbar-height)" }}>
      <TopbarBreadcrumb />
      <TopbarSearch />
    </header>
  );
}
