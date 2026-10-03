import { describe, it, expect } from 'vitest';
import {
  parsePlpSearchParams,
  buildPlpHref,
  toApiQuery,
  PAGE_SIZE,
} from './plp-params';
import { PlpQuery } from '@/types/plp';

// Helper to convert href string back into Record<string, string> for parsePlpSearchParams
function extractRawParams(href: string): Record<string, string> {
  const parts = href.split('?');
  if (parts.length < 2) return {};
  const searchParams = new URLSearchParams(parts[1]);
  const raw: Record<string, string> = {};
  searchParams.forEach((val, key) => {
    raw[key] = val;
  });
  return raw;
}

describe('plp-params', () => {
  describe('parsePlpSearchParams - defaults', () => {
    it('returns default query when given empty object', () => {
      const parsed = parsePlpSearchParams({});
      expect(parsed).toEqual({
        page: 1,
        sort: 'recommended',
        category: [],
      });
    });

    it('returns default query when given undefined or empty values', () => {
      const parsed = parsePlpSearchParams({
        page: '',
        sort: '',
        category: '',
        q: '   ',
      });
      expect(parsed).toEqual({
        page: 1,
        sort: 'recommended',
        category: [],
      });
    });

    it('parses URLSearchParams instances directly', () => {
      const sp = new URLSearchParams('page=3&sort=price_asc&category=electronics,men&minPrice=20');
      const parsed = parsePlpSearchParams(sp);
      expect(parsed).toEqual({
        page: 3,
        sort: 'price_asc',
        category: ['electronics', 'men'],
        minPrice: 20,
      });
    });
  });

  describe('parsePlpSearchParams - invalid values and garbage handling', () => {
    it('sanitizes invalid page values', () => {
      expect(parsePlpSearchParams({ page: '-5' }).page).toBe(1);
      expect(parsePlpSearchParams({ page: '0' }).page).toBe(1);
      expect(parsePlpSearchParams({ page: 'abc' }).page).toBe(1);
      expect(parsePlpSearchParams({ page: 'NaN' }).page).toBe(1);
      expect(parsePlpSearchParams({ page: ['3', '4'] }).page).toBe(3);
    });

    it('sanitizes sort values against whitelist', () => {
      expect(parsePlpSearchParams({ sort: 'bogus' }).sort).toBe('recommended');
      expect(parsePlpSearchParams({ sort: 'PRICE_ASC' }).sort).toBe('recommended');
      expect(parsePlpSearchParams({ sort: 'price_asc' }).sort).toBe('price_asc');
      expect(parsePlpSearchParams({ sort: 'newest' }).sort).toBe('newest');
      expect(parsePlpSearchParams({ sort: 'popular' }).sort).toBe('popular');
      expect(parsePlpSearchParams({ sort: 'price_desc' }).sort).toBe('price_desc');
    });

    it('filters and normalizes category slugs', () => {
      const parsed = parsePlpSearchParams({
        category: 'electronics, INVALID_SLUG!, women-clothing, electronics, <script>',
      });
      expect(parsed.category).toEqual(['electronics', 'women-clothing']);
    });

    it('caps category slugs at 10 items', () => {
      const manySlugs = Array.from({ length: 15 }, (_, i) => `cat-${i}`).join(',');
      const parsed = parsePlpSearchParams({ category: manySlugs });
      expect(parsed.category).toHaveLength(10);
    });

    it('handles invalid and inverted price ranges', () => {
      // Negative / invalid prices ignored
      expect(parsePlpSearchParams({ minPrice: '-10', maxPrice: 'abc' })).toEqual({
        page: 1,
        sort: 'recommended',
        category: [],
      });

      // Valid prices preserved
      const valid = parsePlpSearchParams({ minPrice: '15.5', maxPrice: '99.9' });
      expect(valid.minPrice).toBe(15.5);
      expect(valid.maxPrice).toBe(99.9);

      // Inverted prices swapped automatically
      const inverted = parsePlpSearchParams({ minPrice: '100', maxPrice: '20' });
      expect(inverted.minPrice).toBe(20);
      expect(inverted.maxPrice).toBe(100);
    });

    it('sanitizes minRating within 0..5', () => {
      expect(parsePlpSearchParams({ minRating: '-1' }).minRating).toBeUndefined();
      expect(parsePlpSearchParams({ minRating: '6' }).minRating).toBeUndefined();
      expect(parsePlpSearchParams({ minRating: '4.5' }).minRating).toBe(4.5);
      expect(parsePlpSearchParams({ minRating: '0' }).minRating).toBe(0);
      expect(parsePlpSearchParams({ minRating: '5' }).minRating).toBe(5);
    });

    it('never throws on arbitrary garbage', () => {
      expect(() => {
        parsePlpSearchParams({
          page: '$$$!@#',
          sort: 'undefined',
          category: ['$$$', '???', '---'],
          minPrice: 'null',
          maxPrice: 'Infinity',
          minRating: 'NaN',
          q: '  ',
        });
      }).not.toThrow();
    });
  });

  describe('buildPlpHref - canonical ordering & omitting defaults', () => {
    const baseQuery: PlpQuery = {
      page: 1,
      sort: 'recommended',
      category: [],
    };

    it('omits defaults resulting in clean /products', () => {
      const href = buildPlpHref(baseQuery, {});
      expect(href).toBe('/products');
    });

    it('sorts category slugs alphabetically for stable canonical URLs', () => {
      const href = buildPlpHref(baseQuery, {
        category: ['women-clothing', 'electronics', 'jewelery'],
      });
      expect(href).toBe('/products?category=electronics%2Cjewelery%2Cwomen-clothing');
    });

    it('includes page only when page > 1', () => {
      expect(buildPlpHref(baseQuery, { page: 1 })).toBe('/products');
      expect(buildPlpHref(baseQuery, { page: 3 })).toBe('/products?page=3');
    });

    it('includes sort only when sort != recommended', () => {
      expect(buildPlpHref(baseQuery, { sort: 'recommended' })).toBe('/products');
      expect(buildPlpHref(baseQuery, { sort: 'newest' })).toBe('/products?sort=newest');
    });
  });

  describe('buildPlpHref - page reset behavior', () => {
    const page3Query: PlpQuery = {
      page: 3,
      sort: 'recommended',
      category: ['electronics'],
      minPrice: 10,
    };

    it('resets page to 1 when a filter changes', () => {
      const hrefCategoryChange = buildPlpHref(page3Query, {
        category: ['jewelery'],
      });
      expect(hrefCategoryChange).not.toContain('page=');
      expect(hrefCategoryChange).toBe('/products?category=jewelery&minPrice=10');

      const hrefSortChange = buildPlpHref(page3Query, {
        sort: 'price_asc',
      });
      expect(hrefSortChange).not.toContain('page=');
      expect(hrefSortChange).toBe(
        '/products?sort=price_asc&category=electronics&minPrice=10',
      );

      const hrefPriceChange = buildPlpHref(page3Query, {
        minPrice: 25,
      });
      expect(hrefPriceChange).not.toContain('page=');
      expect(hrefPriceChange).toBe('/products?category=electronics&minPrice=25');
    });

    it('preserves or applies page when patch explicitly specifies page', () => {
      const hrefWithExplicitPage = buildPlpHref(page3Query, {
        category: ['jewelery'],
        page: 4,
      });
      expect(hrefWithExplicitPage).toContain('page=4');
      expect(hrefWithExplicitPage).toBe('/products?page=4&category=jewelery&minPrice=10');
    });

    it('updates only page when no filters change', () => {
      const href = buildPlpHref(page3Query, { page: 5 });
      expect(href).toBe('/products?page=5&category=electronics&minPrice=10');
    });
  });

  describe('buildPlpHref - removal of a filter', () => {
    const queryWithFilters: PlpQuery = {
      page: 2,
      sort: 'popular',
      category: ['electronics'],
      minPrice: 20,
      maxPrice: 100,
      minRating: 4,
      q: 'jacket',
    };

    it('removes a filter when patched with undefined or empty array', () => {
      const href = buildPlpHref(queryWithFilters, {
        minPrice: undefined,
        category: [],
        q: undefined,
      });
      expect(href).not.toContain('minPrice');
      expect(href).not.toContain('category');
      expect(href).not.toContain('q');
      // filter change also resets page to 1
      expect(href).toBe('/products?sort=popular&maxPrice=100&minRating=4');
    });
  });

  describe('Round trip: parse(build(x)) == x', () => {
    it('guarantees round-trip equality for full valid query', () => {
      const initial: PlpQuery = {
        page: 2,
        sort: 'price_desc',
        category: ['electronics', 'jewelery'],
        minPrice: 15,
        maxPrice: 250,
        minRating: 3.5,
        q: 'shirt',
      };

      const href = buildPlpHref(initial, {});
      const raw = extractRawParams(href);
      const parsed = parsePlpSearchParams(raw);

      expect(parsed).toEqual(initial);
    });

    it('guarantees round-trip equality for default query', () => {
      const initial: PlpQuery = {
        page: 1,
        sort: 'recommended',
        category: [],
      };

      const href = buildPlpHref(initial, {});
      expect(href).toBe('/products');
      const raw = extractRawParams(href);
      const parsed = parsePlpSearchParams(raw);

      expect(parsed).toEqual(initial);
    });
  });

  describe('XSS and special character handling', () => {
    it('preserves XSS-looking query strings as plain trimmed strings without executing or breaking', () => {
      const xssString = '<script>alert("xss")</script>';
      const parsed = parsePlpSearchParams({ q: `  ${xssString}  ` });
      expect(parsed.q).toBe(xssString);

      const href = buildPlpHref(parsed, {});
      expect(decodeURIComponent(href)).toContain(xssString);

      const raw = extractRawParams(href);
      const roundTrip = parsePlpSearchParams(raw);
      expect(roundTrip.q).toBe(xssString);
    });

    it('truncates search string to 80 characters', () => {
      const longString = 'a'.repeat(100);
      const parsed = parsePlpSearchParams({ q: longString });
      expect(parsed.q).toHaveLength(80);
      expect(parsed.q).toBe('a'.repeat(80));
    });
  });

  describe('toApiQuery', () => {
    it('transforms PlpQuery into API query record with default limit 12', () => {
      const query: PlpQuery = {
        page: 2,
        sort: 'newest',
        category: ['jewelery', 'electronics'],
        minPrice: 10,
        maxPrice: 150,
        minRating: 4,
        q: 'ring',
      };

      const apiQuery = toApiQuery(query);
      expect(apiQuery).toEqual({
        page: 2,
        limit: PAGE_SIZE,
        sort: 'newest',
        category: 'electronics,jewelery',
        minPrice: 10,
        maxPrice: 150,
        minRating: 4,
        q: 'ring',
      });
      expect(PAGE_SIZE).toBe(12);
    });

    it('handles minimal query with defaults', () => {
      const query: PlpQuery = {
        page: 1,
        sort: 'recommended',
        category: [],
      };

      const apiQuery = toApiQuery(query);
      expect(apiQuery).toEqual({
        page: 1,
        limit: 12,
        sort: 'recommended',
      });
    });
  });
});
