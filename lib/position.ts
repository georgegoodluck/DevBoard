const GAP = 1024;

/** Computes a position for inserting at `index` into `items` (already sorted by position, with the dragged item excluded). */
export function positionForInsert(
  items: { position: number }[],
  index: number,
): number {
  if (items.length === 0) return GAP;
  if (index <= 0) return items[0]!.position - GAP;
  if (index >= items.length) return items[items.length - 1]!.position + GAP;
  const before = items[index - 1]!.position;
  const after = items[index]!.position;
  return (before + after) / 2;
}
