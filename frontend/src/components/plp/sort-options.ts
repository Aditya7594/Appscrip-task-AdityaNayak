import { SortKey } from '@/types/plp';

export interface SortOption {
  label: string;
  value: SortKey;
}

export const SORT_OPTIONS: SortOption[] = [
  { label: 'Recommended', value: 'recommended' },
  { label: 'Newest first', value: 'newest' },
  { label: 'Popular', value: 'popular' },
  { label: 'Price : high to low', value: 'price_desc' },
  { label: 'Price : low to high', value: 'price_asc' },
];
