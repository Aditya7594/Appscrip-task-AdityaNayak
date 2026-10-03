export type SortKey =
  | 'recommended'
  | 'newest'
  | 'popular'
  | 'price_asc'
  | 'price_desc';

export interface PlpQuery {
  page: number;
  sort: SortKey;
  category: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  q?: string;
}
