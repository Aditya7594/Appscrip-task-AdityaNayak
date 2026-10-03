import { describe, it, expect } from 'vitest';
import {
  PRICE_RANGES,
  findMatchingPriceRange,
  RATING_OPTIONS,
} from './price-ranges';

describe('price-ranges', () => {
  it('defines the 5 price ranges per spec', () => {
    expect(PRICE_RANGES).toHaveLength(5);
    expect(PRICE_RANGES[0]).toEqual({ id: 'under-25', label: 'Under $25', max: 25 });
    expect(PRICE_RANGES[1]).toEqual({ id: '25-50', label: '$25 - $50', min: 25, max: 50 });
    expect(PRICE_RANGES[2]).toEqual({ id: '50-100', label: '$50 - $100', min: 50, max: 100 });
    expect(PRICE_RANGES[3]).toEqual({ id: '100-250', label: '$100 - $250', min: 100, max: 250 });
    expect(PRICE_RANGES[4]).toEqual({ id: '250-plus', label: '$250 and above', min: 250 });
  });

  it('detects matching price range for given minPrice and maxPrice', () => {
    expect(findMatchingPriceRange(undefined, 25)).toEqual(PRICE_RANGES[0]);
    expect(findMatchingPriceRange(25, 50)).toEqual(PRICE_RANGES[1]);
    expect(findMatchingPriceRange(50, 100)).toEqual(PRICE_RANGES[2]);
    expect(findMatchingPriceRange(100, 250)).toEqual(PRICE_RANGES[3]);
    expect(findMatchingPriceRange(250, undefined)).toEqual(PRICE_RANGES[4]);
  });

  it('returns undefined when no range matches or when prices are unset', () => {
    expect(findMatchingPriceRange(undefined, undefined)).toBeUndefined();
    expect(findMatchingPriceRange(10, 20)).toBeUndefined();
    expect(findMatchingPriceRange(30, undefined)).toBeUndefined();
  });

  it('defines the 3 rating options per spec', () => {
    expect(RATING_OPTIONS).toEqual([
      { id: 'rating-4', label: '4 stars and up', minRating: 4 },
      { id: 'rating-3', label: '3 stars and up', minRating: 3 },
      { id: 'rating-2', label: '2 stars and up', minRating: 2 },
    ]);
  });
});
