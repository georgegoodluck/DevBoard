import TopbarActions from "./TopbarActions";
import TopbarBreadcrumb from "./TopbarBreadcrumb";
import TopbarSearch from "./TopbarSearch";

export default function Topbar() {
  return (
    <header
      className="flex items-center gap-3 px-5 bg-[var(--bg1)] border-b border-[var(--border)]"
      style={{ height: "var(--topbar-height)" }}
    >
      <TopbarBreadcrumb />
      <div className="flex items-center gap-3 ml-auto">
        <TopbarSearch />
        <TopbarActions />
      </div>
    </header>
  );
}
