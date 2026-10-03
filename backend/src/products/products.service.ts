import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { ListProductsQueryDto } from './dto/list-products-query.dto.js';
import { PaginatedProductsDto } from './dto/paginated-products.dto.js';
import { mapProductToDto } from './products.mapper.js';
import { getProductOrderBy } from './products.sort.js';

@Injectable()
export class ProductsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async findAll(query: ListProductsQueryDto): Promise<PaginatedProductsDto> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 12;

    const where: Prisma.ProductWhereInput = {};

    // Filter by categories (empty array or unknown slug results in empty list if not matched)
    if (query.category && query.category.length > 0) {
      where.category = {
        slug: {
          in: query.category,
        },
      };
    }

    // Filter by price range
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.price = {};
      if (query.minPrice !== undefined) {
        where.price.gte = query.minPrice;
      }
      if (query.maxPrice !== undefined) {
        where.price.lte = query.maxPrice;
      }
    }

    // Filter by minimum rating
    if (query.minRating !== undefined) {
      where.rating = {
        gte: query.minRating,
      };
    }

    // Filter by search query in title and description (case-insensitive)
    if (query.q) {
      const searchTerm = query.q.trim();
      if (searchTerm.length > 0) {
        where.OR = [
          {
            title: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        ];
      }
    }

    const orderBy = getProductOrderBy(query.sort);
    const skip = (page - 1) * limit;

    // Execute count and paginated query in a single atomic database transaction
    const [total, items] = await this.prisma.$transaction([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: true,
          images: {
            orderBy: {
              position: 'asc',
            },
          },
        },
      }),
    ]);

    const totalPages = total === 0 ? 0 : Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1 && totalPages > 0;

    /**
     * If the requested page exceeds totalPages (e.g. page 6 when only 5 pages exist),
     * return 200 HTTP OK with an empty data array while preserving accurate metadata.
     * Note: Prisma skip with skip >= total already yields an empty array, but we enforce this explicitly.
     */
    const data = page > totalPages && totalPages > 0 ? [] : items.map(mapProductToDto);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    };
  }
}
