import TopbarActions from "./TopbarActions";
import TopbarBreadcrumb from "./TopbarBreadcrumb";
import TopbarSearch from "./TopbarSearch";
import MobileTopbar from "../mobile/MobileTopbar";

export default function Topbar() {
  return (
    <>
      {/* Mobile Topbar */}
      <div className="lg:hidden">
        <MobileTopbar />
      </div>
      {/* Desktop Topbar */}
      <header
        className="hidden lg:flex items-center gap-3 px-5 bg-(--bg1) border-b border-(--border)"
        style={{ height: "var(--topbar-height)" }}
      >
        <TopbarBreadcrumb />
        <div className="flex items-center gap-3 ml-auto">
          <TopbarSearch />
          <TopbarActions />
        </div>
      </header>
    </>
  );
}
