import 'server-only';
import { cache } from 'react';
import { apiFetch } from './client';
import { Category } from '@/types/product';

export const getCategories = cache(async (): Promise<Category[]> => {
  return apiFetch<Category[]>('/categories', {
    revalidate: 60,
  });
});
