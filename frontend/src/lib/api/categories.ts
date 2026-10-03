import 'server-only';
import { apiFetch } from './client';
import { Category } from '@/types/product';

export async function getCategories(): Promise<Category[]> {
  return apiFetch<Category[]>('/categories', {
    revalidate: 60,
  });
}
