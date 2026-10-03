import { Prisma } from '@prisma/client';

export enum ProductSortOrder {
  RECOMMENDED = 'recommended',
  NEWEST = 'newest',
  POPULAR = 'popular',
  PRICE_ASC = 'price_asc',
  PRICE_DESC = 'price_desc',
}

export type PrismaProductOrderBy = Prisma.ProductOrderByWithRelationInput[];

/**
 * Single source of truth for ordering Product queries.
 * Every sort order ALWAYS includes an `id` tie-breaker to ensure stable pagination.
 */
export function getProductOrderBy(
  sort: ProductSortOrder = ProductSortOrder.RECOMMENDED,
): PrismaProductOrderBy {
  switch (sort) {
    case ProductSortOrder.NEWEST:
      return [{ createdAt: 'desc' }, { id: 'desc' }];
    case ProductSortOrder.POPULAR:
      return [{ ratingCount: 'desc' }, { id: 'asc' }];
    case ProductSortOrder.PRICE_ASC:
      return [{ price: 'asc' }, { id: 'asc' }];
    case ProductSortOrder.PRICE_DESC:
      return [{ price: 'desc' }, { id: 'desc' }];
    case ProductSortOrder.RECOMMENDED:
    default:
      return [{ rating: 'desc' }, { ratingCount: 'desc' }, { id: 'asc' }];
  }
}
