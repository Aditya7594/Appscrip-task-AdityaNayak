export interface PriceRange {
  id: string;
  label: string;
  min?: number;
  max?: number;
}

export const PRICE_RANGES: PriceRange[] = [
  { id: 'under-25', label: 'Under $25', max: 25 },
  { id: '25-50', label: '$25 - $50', min: 25, max: 50 },
  { id: '50-100', label: '$50 - $100', min: 50, max: 100 },
  { id: '100-250', label: '$100 - $250', min: 100, max: 250 },
  { id: '250-plus', label: '$250 and above', min: 250 },
];

/**
 * Returns the PRICE_RANGE matching the current minPrice and maxPrice query parameters, if any.
 */
export function findMatchingPriceRange(
  minPrice?: number,
  maxPrice?: number,
): PriceRange | undefined {
  if (minPrice === undefined && maxPrice === undefined) {
    return undefined;
  }
  return PRICE_RANGES.find((range) => {
    const minMatches = range.min === undefined ? minPrice === undefined : range.min === minPrice;
    const maxMatches = range.max === undefined ? maxPrice === undefined : range.max === maxPrice;
    return minMatches && maxMatches;
  });
}

export interface RatingOption {
  id: string;
  label: string;
  minRating: number;
}

export const RATING_OPTIONS: RatingOption[] = [
  { id: 'rating-4', label: '4 stars and up', minRating: 4 },
  { id: 'rating-3', label: '3 stars and up', minRating: 3 },
  { id: 'rating-2', label: '2 stars and up', minRating: 2 },
];
