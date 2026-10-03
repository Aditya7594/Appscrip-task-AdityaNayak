import { PlpQuery, SortKey } from '@/types/plp';

export const PAGE_SIZE = 12;

export const SORT_KEYS: SortKey[] = [
  'recommended',
  'newest',
  'popular',
  'price_asc',
  'price_desc',
];

const SLUG_REGEX = /^[a-z0-9-]+$/;

/**
 * Parses raw search params (from Next.js page searchParams or URLSearchParams)
 * into a sanitized PlpQuery object. Never throws.
 */
export function parsePlpSearchParams(
  raw: Record<string, string | string[] | undefined> = {},
): PlpQuery {
  // Page: integer >= 1 (default 1)
  const rawPage = Array.isArray(raw.page) ? raw.page[0] : raw.page;
  const parsedPage = parseInt(String(rawPage), 10);
  const page = Number.isInteger(parsedPage) && parsedPage >= 1 ? parsedPage : 1;

  // Sort: whitelist (default 'recommended')
  const rawSort = Array.isArray(raw.sort) ? raw.sort[0] : raw.sort;
  const sort: SortKey =
    typeof rawSort === 'string' && (SORT_KEYS as readonly string[]).includes(rawSort)
      ? (rawSort as SortKey)
      : 'recommended';

  // Category: unique slugs matching /^[a-z0-9-]+$/ (comma-separated, max 10)
  let rawSlugs: string[] = [];
  if (Array.isArray(raw.category)) {
    rawSlugs = raw.category.flatMap((c) => (typeof c === 'string' ? c.split(',') : []));
  } else if (typeof raw.category === 'string') {
    rawSlugs = raw.category.split(',');
  }

  const uniqueValidSlugs = Array.from(
    new Set(
      rawSlugs
        .map((s) => s.trim().toLowerCase())
        .filter((s) => SLUG_REGEX.test(s)),
    ),
  ).slice(0, 10);

  // Prices: non-negative finite numbers
  let minPrice: number | undefined;
  let maxPrice: number | undefined;

  const rawMinPrice = Array.isArray(raw.minPrice) ? raw.minPrice[0] : raw.minPrice;
  if (rawMinPrice !== undefined && rawMinPrice !== '') {
    const num = Number(rawMinPrice);
    if (Number.isFinite(num) && num >= 0) {
      minPrice = num;
    }
  }

  const rawMaxPrice = Array.isArray(raw.maxPrice) ? raw.maxPrice[0] : raw.maxPrice;
  if (rawMaxPrice !== undefined && rawMaxPrice !== '') {
    const num = Number(rawMaxPrice);
    if (Number.isFinite(num) && num >= 0) {
      maxPrice = num;
    }
  }

  // Ensure minPrice <= maxPrice; swap if inverted
  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
    const temp = minPrice;
    minPrice = maxPrice;
    maxPrice = temp;
  }

  // Rating: 0..5
  let minRating: number | undefined;
  const rawMinRating = Array.isArray(raw.minRating) ? raw.minRating[0] : raw.minRating;
  if (rawMinRating !== undefined && rawMinRating !== '') {
    const num = Number(rawMinRating);
    if (Number.isFinite(num) && num >= 0 && num <= 5) {
      minRating = num;
    }
  }

  // Search query q: trimmed 1..80 characters
  let q: string | undefined;
  const rawQ = Array.isArray(raw.q) ? raw.q[0] : raw.q;
  if (typeof rawQ === 'string') {
    const trimmed = rawQ.trim();
    if (trimmed.length >= 1) {
      q = trimmed.slice(0, 80);
    }
  }

  const result: PlpQuery = {
    page,
    sort,
    category: uniqueValidSlugs,
  };

  if (minPrice !== undefined) result.minPrice = minPrice;
  if (maxPrice !== undefined) result.maxPrice = maxPrice;
  if (minRating !== undefined) result.minRating = minRating;
  if (q !== undefined) result.q = q;

  return result;
}

/**
 * Builds a canonical href for /products applying the partial patch.
 * Resets page to 1 when filters, sort, or q change (unless patch explicitly sets page).
 * Omits defaults (page=1, sort='recommended', empty arrays/values).
 * Sorts category slugs alphabetically for stable canonical URLs.
 */
export function buildPlpHref(
  current: PlpQuery,
  patch: Partial<PlpQuery>,
): string {
  const nextSort = patch.sort !== undefined ? patch.sort : current.sort;
  const nextCategory = patch.category !== undefined ? patch.category : current.category;
  const nextMinPrice = 'minPrice' in patch ? patch.minPrice : current.minPrice;
  const nextMaxPrice = 'maxPrice' in patch ? patch.maxPrice : current.maxPrice;
  const nextMinRating = 'minRating' in patch ? patch.minRating : current.minRating;
  const nextQ = 'q' in patch ? patch.q : current.q;

  // Determine if filters, sort, or q changed to trigger page reset to 1
  const sortChanged = nextSort !== current.sort;
  const currentCats = [...(current.category || [])].sort().join(',');
  const nextCats = [...(nextCategory || [])].sort().join(',');
  const categoryChanged = currentCats !== nextCats;
  const minPriceChanged = nextMinPrice !== current.minPrice;
  const maxPriceChanged = nextMaxPrice !== current.maxPrice;
  const minRatingChanged = nextMinRating !== current.minRating;
  const qChanged = nextQ !== current.q;

  const filtersChanged =
    sortChanged ||
    categoryChanged ||
    minPriceChanged ||
    maxPriceChanged ||
    minRatingChanged ||
    qChanged;

  let nextPage: number;
  if (patch.page !== undefined) {
    nextPage = patch.page;
  } else if (filtersChanged) {
    nextPage = 1;
  } else {
    nextPage = current.page || 1;
  }

  const searchParams = new URLSearchParams();

  // Omit default page 1
  if (nextPage > 1) {
    searchParams.set('page', String(nextPage));
  }

  // Omit default sort 'recommended'
  if (nextSort && nextSort !== 'recommended') {
    searchParams.set('sort', nextSort);
  }

  // Sort categories alphabetically and omit if empty
  if (nextCategory && nextCategory.length > 0) {
    const sortedSlugs = Array.from(new Set(nextCategory))
      .filter((s) => SLUG_REGEX.test(s))
      .sort();
    if (sortedSlugs.length > 0) {
      searchParams.set('category', sortedSlugs.join(','));
    }
  }

  if (nextMinPrice !== undefined && Number.isFinite(nextMinPrice) && nextMinPrice >= 0) {
    searchParams.set('minPrice', String(nextMinPrice));
  }

  if (nextMaxPrice !== undefined && Number.isFinite(nextMaxPrice) && nextMaxPrice >= 0) {
    searchParams.set('maxPrice', String(nextMaxPrice));
  }

  if (
    nextMinRating !== undefined &&
    Number.isFinite(nextMinRating) &&
    nextMinRating >= 0 &&
    nextMinRating <= 5
  ) {
    searchParams.set('minRating', String(nextMinRating));
  }

  if (nextQ && nextQ.trim()) {
    searchParams.set('q', nextQ.trim().slice(0, 80));
  }

  const qs = searchParams.toString();
  return qs ? `/products?${qs}` : '/products';
}

/**
 * Transforms PlpQuery to API query record for getProducts fetch call.
 */
export function toApiQuery(
  query: PlpQuery,
): Record<string, string | number> {
  const apiQuery: Record<string, string | number> = {
    page: query.page >= 1 ? query.page : 1,
    limit: PAGE_SIZE,
  };

  if (query.sort) {
    apiQuery.sort = query.sort;
  }

  if (query.category && query.category.length > 0) {
    apiQuery.category = [...query.category].sort().join(',');
  }

  if (query.minPrice !== undefined) {
    apiQuery.minPrice = query.minPrice;
  }

  if (query.maxPrice !== undefined) {
    apiQuery.maxPrice = query.maxPrice;
  }

  if (query.minRating !== undefined) {
    apiQuery.minRating = query.minRating;
  }

  if (query.q && query.q.trim()) {
    apiQuery.q = query.q.trim();
  }

  return apiQuery;
}
