import 'server-only';
import { cache } from 'react';
import { apiFetch } from './client';
import { PaginatedProducts } from '@/types/product';
import { PlpQuery } from '@/types/plp';
import { toApiQuery, PAGE_SIZE } from '@/lib/url/plp-params';

export { PAGE_SIZE };

const getProductsInternal = cache(async (queryKey: string): Promise<PaginatedProducts> => {
  const query: PlpQuery = JSON.parse(queryKey);
  const apiQuery = toApiQuery(query);
  return apiFetch<PaginatedProducts>('/products', {
    query: apiQuery,
    cache: 'no-store',
  });
});

export async function getProducts(query: PlpQuery): Promise<PaginatedProducts> {
  const key = JSON.stringify(query);
  return getProductsInternal(key);
}
