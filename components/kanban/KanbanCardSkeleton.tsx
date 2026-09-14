export function KanbanCardSkeleton() {
  return (
    <div className="flex flex-col gap-2 rounded-devboard border border-border bg-bg1 p-3">
      <div className="h-2.5 w-10 animate-pulse rounded bg-bg3" />
      <div className="h-3.5 w-3/4 animate-pulse rounded bg-bg3" />
      <div className="h-3.5 w-1/2 animate-pulse rounded bg-bg3" />
    </div>
  );
}
