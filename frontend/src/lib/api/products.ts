import 'server-only';
import { apiFetch } from './client';
import { PaginatedProducts } from '@/types/product';
import { PlpQuery } from '@/types/plp';
import { toApiQuery, PAGE_SIZE } from '@/lib/url/plp-params';

export { PAGE_SIZE };

export async function getProducts(query: PlpQuery): Promise<PaginatedProducts> {
  const apiQuery = toApiQuery(query);
  return apiFetch<PaginatedProducts>('/products', {
    query: apiQuery,
    cache: 'no-store',
  });
}
