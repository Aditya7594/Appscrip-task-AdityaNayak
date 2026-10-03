import { Product, Category } from '@/types/product';
import { PlpQuery } from '@/types/plp';
import { absoluteUrl } from './site';

export interface BuildJsonLdParams {
  products: Product[];
  query: PlpQuery;
  categories: Category[];
  canonicalUrl: string;
}

/**
 * Builds schema.org JSON-LD structured data for the current page:
 * 1. BreadcrumbList (Home -> Shop [-> Category])
 * 2. ItemList of Products on the current page with full Offer and AggregateRating details.
 */
export function buildJsonLd({
  products,
  query,
  categories,
  canonicalUrl,
}: BuildJsonLdParams) {
  // Breadcrumb items
  const breadcrumbElements = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: absoluteUrl('/'),
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Shop',
      item: absoluteUrl('/products'),
    },
  ];

  // If exactly one category is selected in the query
  if (query.category && query.category.length === 1) {
    const activeCategory = categories.find((c) => c.slug === query.category[0]);
    if (activeCategory) {
      breadcrumbElements.push({
        '@type': 'ListItem',
        position: 3,
        name: activeCategory.name,
        item: canonicalUrl,
      });
    }
  }

  const breadcrumbList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbElements,
  };

  // Products ItemList
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: products.map((product, index) => {
      const imageUrl = product.images?.[0]?.url
        ? absoluteUrl(product.images[0].url)
        : absoluteUrl('/icon.svg');

      const trimmedDescription =
        product.description.length > 200
          ? `${product.description.slice(0, 197)}...`
          : product.description;

      const productSchema: Record<string, unknown> = {
        '@type': 'Product',
        name: product.title,
        image: [imageUrl],
        description: trimmedDescription,
        sku: product.slug,
        category: product.category?.name || 'General',
        offers: {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: `${canonicalUrl}#product-${product.slug}`,
        },
      };

      if (product.ratingCount && product.ratingCount > 0) {
        productSchema.aggregateRating = {
          '@type': 'AggregateRating',
          ratingValue: product.rating,
          reviewCount: product.ratingCount,
        };
      }

      return {
        '@type': 'ListItem',
        position: index + 1,
        item: productSchema,
      };
    }),
  };

  return [breadcrumbList, itemList];
}
