import { describe, it, expect } from 'vitest';
import { getPaginationItems } from './pagination-items';

describe('getPaginationItems', () => {
  it('handles totalPages = 1', () => {
    const items = getPaginationItems(1, 1);
    expect(items).toEqual([{ type: 'page', page: 1 }]);
    expect(items.length).toBeLessThanOrEqual(7);
  });

  it('handles totalPages = 2', () => {
    const itemsStart = getPaginationItems(1, 2);
    expect(itemsStart).toEqual([
      { type: 'page', page: 1 },
      { type: 'page', page: 2 },
    ]);
    expect(itemsStart.length).toBeLessThanOrEqual(7);

    const itemsEnd = getPaginationItems(2, 2);
    expect(itemsEnd).toEqual([
      { type: 'page', page: 1 },
      { type: 'page', page: 2 },
    ]);
    expect(itemsEnd.length).toBeLessThanOrEqual(7);
  });

  it('handles totalPages = 5 (all pages fit without ellipsis)', () => {
    // start
    const start = getPaginationItems(1, 5);
    expect(start).toEqual([
      { type: 'page', page: 1 },
      { type: 'page', page: 2 },
      { type: 'page', page: 3 },
      { type: 'page', page: 4 },
      { type: 'page', page: 5 },
    ]);

    // middle
    const middle = getPaginationItems(3, 5);
    expect(middle).toEqual([
      { type: 'page', page: 1 },
      { type: 'page', page: 2 },
      { type: 'page', page: 3 },
      { type: 'page', page: 4 },
      { type: 'page', page: 5 },
    ]);

    // end
    const end = getPaginationItems(5, 5);
    expect(end).toEqual([
      { type: 'page', page: 1 },
      { type: 'page', page: 2 },
      { type: 'page', page: 3 },
      { type: 'page', page: 4 },
      { type: 'page', page: 5 },
    ]);
  });

  it('handles totalPages = 7 (boundary without ellipsis)', () => {
    // start
    const start = getPaginationItems(1, 7);
    expect(start).toHaveLength(7);
    expect(start.every((i) => i.type === 'page')).toBe(true);

    // middle
    const middle = getPaginationItems(4, 7);
    expect(middle).toHaveLength(7);
    expect(middle.every((i) => i.type === 'page')).toBe(true);

    // end
    const end = getPaginationItems(7, 7);
    expect(end).toHaveLength(7);
    expect(end.every((i) => i.type === 'page')).toBe(true);
  });

  it('handles totalPages = 12 at start, middle, and end', () => {
    // Current at start (1)
    const start = getPaginationItems(1, 12);
    expect(start).toEqual([
      { type: 'page', page: 1 },
      { type: 'page', page: 2 },
      { type: 'page', page: 3 },
      { type: 'page', page: 4 },
      { type: 'page', page: 5 },
      { type: 'ellipsis' },
      { type: 'page', page: 12 },
    ]);
    expect(start).toHaveLength(7);

    // Current near start (4)
    const nearStart = getPaginationItems(4, 12);
    expect(nearStart).toEqual([
      { type: 'page', page: 1 },
      { type: 'page', page: 2 },
      { type: 'page', page: 3 },
      { type: 'page', page: 4 },
      { type: 'page', page: 5 },
      { type: 'ellipsis' },
      { type: 'page', page: 12 },
    ]);
    expect(nearStart).toHaveLength(7);

    // Current in middle (5) - matches prompt example: 1 ... 4 5 6 ... 12
    const middle5 = getPaginationItems(5, 12);
    expect(middle5).toEqual([
      { type: 'page', page: 1 },
      { type: 'ellipsis' },
      { type: 'page', page: 4 },
      { type: 'page', page: 5 },
      { type: 'page', page: 6 },
      { type: 'ellipsis' },
      { type: 'page', page: 12 },
    ]);
    expect(middle5).toHaveLength(7);

    // Current in middle (6)
    const middle6 = getPaginationItems(6, 12);
    expect(middle6).toEqual([
      { type: 'page', page: 1 },
      { type: 'ellipsis' },
      { type: 'page', page: 5 },
      { type: 'page', page: 6 },
      { type: 'page', page: 7 },
      { type: 'ellipsis' },
      { type: 'page', page: 12 },
    ]);
    expect(middle6).toHaveLength(7);

    // Current at end (12)
    const end = getPaginationItems(12, 12);
    expect(end).toEqual([
      { type: 'page', page: 1 },
      { type: 'ellipsis' },
      { type: 'page', page: 8 },
      { type: 'page', page: 9 },
      { type: 'page', page: 10 },
      { type: 'page', page: 11 },
      { type: 'page', page: 12 },
    ]);
    expect(end).toHaveLength(7);
  });

  it('guarantees slot count is never more than 7 for any page in 1..20 of 20', () => {
    for (let p = 1; p <= 20; p++) {
      const items = getPaginationItems(p, 20);
      expect(items.length).toBeLessThanOrEqual(7);
    }
  });
});
