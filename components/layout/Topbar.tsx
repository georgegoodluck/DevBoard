import TopbarActions from "./TopbarActions";
import TopbarBreadcrumb from "./TopbarBreadcrumb";
import TopbarSearch from "./TopbarSearch";

export default function Topbar() {
  return (
    <header
      className="flex items-center gap-3 p-2 bg-[var(--bg1)]"
      style={{ height: "var(--topbar-height) border-b"}}
    >
        <TopbarBreadcrumb />
      <div className="flex items-center gap-3 ml-auto">
        <TopbarSearch />
        <TopbarActions />
      </div>
    </header>
  );
}
