import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let prismaService: {
    category: {
      findMany: ReturnType<typeof vitest.fn>;
    };
  };

  beforeEach(async () => {
    prismaService = {
      category: {
        findMany: vitest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call prisma.category.findMany with name asc ordering and product count', async () => {
    const mockDbCategories = [
      {
        id: 1,
        slug: 'electronics',
        name: 'Electronics',
        _count: { products: 6 },
      },
      {
        id: 2,
        slug: 'jewelery',
        name: 'Jewelery',
        _count: { products: 4 },
      },
    ];

    prismaService.category.findMany.mockResolvedValue(mockDbCategories);

    const result = await service.findAll();

    expect(prismaService.category.findMany).toHaveBeenCalledWith({
      orderBy: {
        name: 'asc',
      },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    expect(result).toEqual([
      {
        id: 1,
        slug: 'electronics',
        name: 'Electronics',
        productCount: 6,
      },
      {
        id: 2,
        slug: 'jewelery',
        name: 'Jewelery',
        productCount: 4,
      },
    ]);

    // Ensure raw Prisma internal fields like _count are not leaked
    expect(result[0]).not.toHaveProperty('_count');
    expect(result[1]).not.toHaveProperty('_count');
  });
});
