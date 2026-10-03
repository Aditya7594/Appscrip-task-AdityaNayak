import { Category, Product, ProductImage } from '@prisma/client';
import { ProductDto } from './dto/product.dto.js';

export type ProductWithRelations = Product & {
  category: Category;
  images: ProductImage[];
};

/**
 * Maps a Prisma Product with its relations to the API ProductDto.
 * Ensures Decimal price is converted to a plain number, currency is explicitly 'USD',
 * images are ordered by position, and dates are formatted as ISO 8601 strings.
 */
export function mapProductToDto(product: ProductWithRelations): ProductDto {
  return {
    id: product.id,
    slug: product.slug,
    title: product.title,
    description: product.description,
    price: typeof product.price.toNumber === 'function' ? product.price.toNumber() : Number(product.price),
    currency: 'USD',
    rating: product.rating,
    ratingCount: product.ratingCount,
    category: {
      id: product.category.id,
      slug: product.category.slug,
      name: product.category.name,
    },
    images: [...product.images]
      .sort((a, b) => a.position - b.position)
      .map((image) => ({
        url: image.url,
        alt: image.alt,
        position: image.position,
      })),
    createdAt: product.createdAt.toISOString(),
  };
}
