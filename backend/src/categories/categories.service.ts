import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CategoryDto } from './dto/category.dto.js';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<CategoryDto[]> {
    const categories = await this.prisma.category.findMany({
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

    return categories.map((cat) => ({
      id: cat.id,
      slug: cat.slug,
      name: cat.name,
      productCount: cat._count.products,
    }));
  }
}
