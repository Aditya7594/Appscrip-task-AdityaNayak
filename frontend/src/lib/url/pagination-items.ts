export type PaginationItem =
  | { type: 'page'; page: number }
  | { type: 'ellipsis' };

/**
 * Pure helper generating pagination items.
 * Shows first page, last page, current and its neighbors (current +/- 1) with ellipses.
 * Never produces more than 7 slots (e.g. 1 ... 4 5 6 ... 12).
 */
export function getPaginationItems(
  current: number,
  totalPages: number,
): PaginationItem[] {
  if (totalPages <= 0) {
    return [];
  }

  // When totalPages is 7 or fewer, show all pages without ellipsis
  if (totalPages <= 7) {
    const items: PaginationItem[] = [];
    for (let i = 1; i <= totalPages; i++) {
      items.push({ type: 'page', page: i });
    }
    return items;
  }

  const safeCurrent = Math.max(1, Math.min(current, totalPages));

  // Case 1: Near the start (slots: 1, 2, 3, 4, 5, ..., totalPages) -> 7 slots
  if (safeCurrent <= 4) {
    return [
      { type: 'page', page: 1 },
      { type: 'page', page: 2 },
      { type: 'page', page: 3 },
      { type: 'page', page: 4 },
      { type: 'page', page: 5 },
      { type: 'ellipsis' },
      { type: 'page', page: totalPages },
    ];
  }

  // Case 2: Near the end (slots: 1, ..., totalPages-4, totalPages-3, totalPages-2, totalPages-1, totalPages) -> 7 slots
  if (safeCurrent >= totalPages - 3) {
    return [
      { type: 'page', page: 1 },
      { type: 'ellipsis' },
      { type: 'page', page: totalPages - 4 },
      { type: 'page', page: totalPages - 3 },
      { type: 'page', page: totalPages - 2 },
      { type: 'page', page: totalPages - 1 },
      { type: 'page', page: totalPages },
    ];
  }

  // Case 3: In the middle (slots: 1, ..., current-1, current, current+1, ..., totalPages) -> 7 slots
  return [
    { type: 'page', page: 1 },
    { type: 'ellipsis' },
    { type: 'page', page: safeCurrent - 1 },
    { type: 'page', page: safeCurrent },
    { type: 'page', page: safeCurrent + 1 },
    { type: 'ellipsis' },
    { type: 'page', page: totalPages },
  ];
}
