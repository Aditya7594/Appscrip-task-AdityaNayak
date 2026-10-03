import { describe, it, expect } from 'vitest';
import { SORT_OPTIONS } from './SortDropdown';

describe('SortDropdown options', () => {
  it('has exactly 5 options in Figma specified order and values', () => {
    expect(SORT_OPTIONS).toEqual([
      { label: 'Recommended', value: 'recommended' },
      { label: 'Newest first', value: 'newest' },
      { label: 'Popular', value: 'popular' },
      { label: 'Price : high to low', value: 'price_desc' },
      { label: 'Price : low to high', value: 'price_asc' },
    ]);
  });
});
