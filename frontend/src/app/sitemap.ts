import type { MetadataRoute } from 'next';
import { getCategories } from '@/lib/api';
import { absoluteUrl } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const categories = await getCategories().catch(() => []);
  const now = new Date();

  const routes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl('/products'),
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

  for (const cat of categories) {
    routes.push({
      url: absoluteUrl(`/products?category=${encodeURIComponent(cat.slug)}`),
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    });
  }

  return routes;
}
