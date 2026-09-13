import { TopbarBreadcrumb } from "./TopbarBreadcrumb";
import { TopbarSearch } from "./TopbarSearch";
import { TopbarActions } from "./TopbarActions";

export function Topbar() {
  return (
    <header className="flex h-topbar shrink-0 items-center justify-between border-b border-border bg-bg1 px-4">
      <TopbarBreadcrumb />
      <div className="flex items-center gap-4">
        <TopbarSearch />
        <TopbarActions />
      </div>
    </header>
  );
}
