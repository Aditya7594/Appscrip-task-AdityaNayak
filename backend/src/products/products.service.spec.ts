import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { ProductsService } from './products.service.js';
import { ProductSortOrder } from './products.sort.js';

describe('ProductsService', () => {
  let service: ProductsService;
  let prismaService: {
    $transaction: ReturnType<typeof vitest.fn>;
    product: {
      count: ReturnType<typeof vitest.fn>;
      findMany: ReturnType<typeof vitest.fn>;
      findUnique: ReturnType<typeof vitest.fn>;
    };
  };

  const sampleProduct = {
    id: 1,
    slug: 'mens-cotton-jacket',
    title: "Men's Cotton Jacket",
    description: 'Great outerwear jackets for Spring/Autumn/Winter.',
    price: new Prisma.Decimal(55.99),
    rating: 4.7,
    ratingCount: 500,
    categoryId: 1,
    createdAt: new Date('2026-10-01T00:00:00.000Z'),
    updatedAt: new Date('2026-10-01T00:00:00.000Z'),
    category: {
      id: 1,
      slug: 'mens-clothing',
      name: "Men's Clothing",
    },
    images: [
      {
        id: 2,
        productId: 1,
        url: '/products/mens-cotton-jacket-2.jpg',
        alt: 'Angle 2',
        position: 1,
      },
      {
        id: 1,
        productId: 1,
        url: '/products/mens-cotton-jacket.jpg',
        alt: 'Main Photo',
        position: 0,
      },
    ],
  };

  beforeEach(async () => {
    prismaService = {
      $transaction: vitest.fn(),
      product: {
        count: vitest.fn(),
        findMany: vitest.fn(),
        findUnique: vitest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should run findMany and count in one $transaction with default pagination and sorting', async () => {
    prismaService.$transaction.mockImplementation(async (promises: Promise<unknown>[]) => {
      return Promise.all(promises);
    });
    prismaService.product.count.mockResolvedValue(60);
    prismaService.product.findMany.mockResolvedValue([sampleProduct]);

    const result = await service.findAll({
      page: 1,
      limit: 12,
      sort: ProductSortOrder.RECOMMENDED,
    });

    expect(prismaService.$transaction).toHaveBeenCalledTimes(1);
    expect(prismaService.product.count).toHaveBeenCalledWith({
      where: {},
    });
    expect(prismaService.product.findMany).toHaveBeenCalledWith({
      where: {},
      orderBy: [{ rating: 'desc' }, { ratingCount: 'desc' }, { id: 'asc' }],
      skip: 0,
      take: 12,
      include: {
        category: true,
        images: {
          orderBy: {
            position: 'asc',
          },
        },
      },
    });

    expect(result.data).toHaveLength(1);
    expect(result.data[0]).toEqual({
      id: 1,
      slug: 'mens-cotton-jacket',
      title: "Men's Cotton Jacket",
      description: 'Great outerwear jackets for Spring/Autumn/Winter.',
      price: 55.99,
      currency: 'USD',
      rating: 4.7,
      ratingCount: 500,
      category: {
        id: 1,
        slug: 'mens-clothing',
        name: "Men's Clothing",
      },
      images: [
        {
          url: '/products/mens-cotton-jacket.jpg',
          alt: 'Main Photo',
          position: 0,
        },
        {
          url: '/products/mens-cotton-jacket-2.jpg',
          alt: 'Angle 2',
          position: 1,
        },
      ],
      createdAt: '2026-10-01T00:00:00.000Z',
    });

    expect(result.meta).toEqual({
      page: 1,
      limit: 12,
      total: 60,
      totalPages: 5,
      hasNextPage: true,
      hasPreviousPage: false,
    });
  });

  it('should build where conditions for categories, price range, minRating, and text search', async () => {
    prismaService.$transaction.mockImplementation(async (promises: Promise<unknown>[]) => {
      return Promise.all(promises);
    });
    prismaService.product.count.mockResolvedValue(3);
    prismaService.product.findMany.mockResolvedValue([sampleProduct]);

    const result = await service.findAll({
      page: 2,
      limit: 5,
      category: ['mens-clothing', 'jewelery'],
      minPrice: 20,
      maxPrice: 60,
      minRating: 4.0,
      q: 'jacket',
      sort: ProductSortOrder.PRICE_ASC,
    });

    expect(prismaService.product.count).toHaveBeenCalledWith({
      where: {
        category: {
          slug: {
            in: ['mens-clothing', 'jewelery'],
          },
        },
        price: {
          gte: 20,
          lte: 60,
        },
        rating: {
          gte: 4.0,
        },
        OR: [
          { title: { contains: 'jacket', mode: 'insensitive' } },
          { description: { contains: 'jacket', mode: 'insensitive' } },
        ],
      },
    });

    expect(prismaService.product.findMany).toHaveBeenCalledWith({
      where: {
        category: {
          slug: {
            in: ['mens-clothing', 'jewelery'],
          },
        },
        price: {
          gte: 20,
          lte: 60,
        },
        rating: {
          gte: 4.0,
        },
        OR: [
          { title: { contains: 'jacket', mode: 'insensitive' } },
          { description: { contains: 'jacket', mode: 'insensitive' } },
        ],
      },
      orderBy: [{ price: 'asc' }, { id: 'asc' }],
      skip: 5,
      take: 5,
      include: {
        category: true,
        images: {
          orderBy: {
            position: 'asc',
          },
        },
      },
    });

    expect(result.meta).toEqual({
      page: 2,
      limit: 5,
      total: 3,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: true,
    });
  });

  it('should return empty data array when page > totalPages while retaining meta', async () => {
    prismaService.$transaction.mockImplementation(async (promises: Promise<unknown>[]) => {
      return Promise.all(promises);
    });
    prismaService.product.count.mockResolvedValue(60);
    prismaService.product.findMany.mockResolvedValue([]);

    const result = await service.findAll({
      page: 10,
      limit: 12,
      sort: ProductSortOrder.RECOMMENDED,
    });

    expect(result.data).toEqual([]);
    expect(result.meta).toEqual({
      page: 10,
      limit: 12,
      total: 60,
      totalPages: 5,
      hasNextPage: false,
      hasPreviousPage: true,
    });
  });

  it('should return empty list when no products match (e.g. unknown category slug)', async () => {
    prismaService.$transaction.mockImplementation(async (promises: Promise<unknown>[]) => {
      return Promise.all(promises);
    });
    prismaService.product.count.mockResolvedValue(0);
    prismaService.product.findMany.mockResolvedValue([]);

    const result = await service.findAll({
      page: 1,
      limit: 12,
      category: ['non-existent-category'],
      sort: ProductSortOrder.RECOMMENDED,
    });

    expect(result.data).toEqual([]);
    expect(result.meta).toEqual({
      page: 1,
      limit: 12,
      total: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    });
  });

  it('should apply correct orderBy for all sort enums with id tie-breaker', async () => {
    prismaService.$transaction.mockImplementation(async (promises: Promise<unknown>[]) => {
      return Promise.all(promises);
    });
    prismaService.product.count.mockResolvedValue(10);
    prismaService.product.findMany.mockResolvedValue([]);

    await service.findAll({ page: 1, limit: 10, sort: ProductSortOrder.NEWEST });
    expect(prismaService.product.findMany).toHaveBeenLastCalledWith(
      expect.objectContaining({
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      }),
    );

    await service.findAll({ page: 1, limit: 10, sort: ProductSortOrder.POPULAR });
    expect(prismaService.product.findMany).toHaveBeenLastCalledWith(
      expect.objectContaining({
        orderBy: [{ ratingCount: 'desc' }, { id: 'asc' }],
      }),
    );

    await service.findAll({ page: 1, limit: 10, sort: ProductSortOrder.PRICE_DESC });
    expect(prismaService.product.findMany).toHaveBeenLastCalledWith(
      expect.objectContaining({
        orderBy: [{ price: 'desc' }, { id: 'desc' }],
      }),
    );
  });

  describe('findById', () => {
    it('should return mapped ProductDto when product exists', async () => {
      prismaService.product.findUnique.mockResolvedValue(sampleProduct);

      const result = await service.findById(1);

      expect(prismaService.product.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          category: true,
          images: {
            orderBy: {
              position: 'asc',
            },
          },
        },
      });

      expect(result).toEqual({
        id: 1,
        slug: 'mens-cotton-jacket',
        title: "Men's Cotton Jacket",
        description: 'Great outerwear jackets for Spring/Autumn/Winter.',
        price: 55.99,
        currency: 'USD',
        rating: 4.7,
        ratingCount: 500,
        category: {
          id: 1,
          slug: 'mens-clothing',
          name: "Men's Clothing",
        },
        images: [
          {
            url: '/products/mens-cotton-jacket.jpg',
            alt: 'Main Photo',
            position: 0,
          },
          {
            url: '/products/mens-cotton-jacket-2.jpg',
            alt: 'Angle 2',
            position: 1,
          },
        ],
        createdAt: '2026-10-01T00:00:00.000Z',
      });
    });

    it('should throw NotFoundException when product does not exist', async () => {
      prismaService.product.findUnique.mockResolvedValue(null);

      await expect(service.findById(99999)).rejects.toThrow('Product 99999 not found');
    });
  });
});
