import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { slugify } from '../common/utils/slugify.js';

interface FakeStoreProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

function createMulberry32(seed: number): () => number {
  let s = seed;
  return function (): number {
    s += 0x6d2b79f5;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function toTitleCase(str: string): string {
  return str
    .split(' ')
    .map((word) => {
      if (word.toLowerCase().includes("'")) {
        const parts = word.split("'");
        return parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase() + "'" + parts[1].toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  public isRealDb = false;
  private inMemoryDb: any = null;

  async onModuleInit(): Promise<void> {
    try {
      await this.$connect();
      this.isRealDb = true;
      this.logger.log('Connected to PostgreSQL database');
    } catch (err) {
      this.isRealDb = false;
      this.logger.warn(
        `PostgreSQL server unreachable at localhost:5432 (${(err as Error).message}). Initializing zero-dependency in-memory seeded store.`,
      );
      this.initInMemoryStore();
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.isRealDb) {
      await this.$disconnect();
    }
  }

  private initInMemoryStore(): void {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const dataFile = path.resolve(__dirname, '../../prisma/data/fakestore-products.json');

    const categories: { id: number; slug: string; name: string }[] = [];
    const products: any[] = [];

    if (fs.existsSync(dataFile)) {
      const rawData = JSON.parse(fs.readFileSync(dataFile, 'utf-8')) as FakeStoreProduct[];
      const categoryMap = new Map<string, { id: number; slug: string; name: string }>();

      let catId = 1;
      for (const p of rawData) {
        if (!categoryMap.has(p.category)) {
          const slug = slugify(p.category);
          const name = toTitleCase(p.category);
          categoryMap.set(p.category, { id: catId++, slug, name });
        }
      }

      categories.push(...Array.from(categoryMap.values()));

      const rand = createMulberry32(123456789);
      const now = Date.now();
      let prodId = 1;

      for (let i = 0; i < rawData.length; i++) {
        const raw = rawData[i];
        const cat = categoryMap.get(raw.category)!;
        const baseSlug = slugify(raw.title);
        const baseDaysAgo = i * 2;
        const baseCreatedAt = new Date(now - baseDaysAgo * 86400000);

        const items = [
          {
            slug: baseSlug,
            title: raw.title,
            description: raw.description,
            price: Number(raw.price.toFixed(2)),
            rating: Math.min(5, Math.max(0, Math.round(raw.rating.rate * 10) / 10)),
            ratingCount: Number(raw.rating.count) || 100,
            createdAt: baseCreatedAt,
          },
          {
            slug: `${baseSlug}-midnight`,
            title: `${raw.title} - Midnight`,
            description: `${raw.description} Limited edition Midnight colorway with signature styling.`,
            price: Math.max(1, Math.round(raw.price * (0.85 + rand() * 0.3) * 100) / 100),
            rating: Math.min(5, Math.max(0, Math.round((raw.rating.rate + (rand() - 0.5) * 0.8) * 10) / 10)),
            ratingCount: Math.max(5, Math.round((Number(raw.rating.count) || 100) * (0.6 + rand() * 0.8))),
            createdAt: new Date(now - (baseDaysAgo + Math.floor(rand() * 5) + 1) * 86400000),
          },
          {
            slug: `${baseSlug}-sand`,
            title: `${raw.title} - Sand`,
            description: `${raw.description} Crafted in an understated Sand palette designed for everyday wear.`,
            price: Math.max(1, Math.round(raw.price * (0.85 + rand() * 0.3) * 100) / 100),
            rating: Math.min(5, Math.max(0, Math.round((raw.rating.rate + (rand() - 0.5) * 0.8) * 10) / 10)),
            ratingCount: Math.max(5, Math.round((Number(raw.rating.count) || 100) * (0.6 + rand() * 0.8))),
            createdAt: new Date(now - (baseDaysAgo + Math.floor(rand() * 5) + 2) * 86400000),
          },
        ];

        for (const item of items) {
          const currentId = prodId++;
          products.push({
            id: currentId,
            slug: item.slug,
            title: item.title,
            description: item.description,
            price: new Prisma.Decimal(item.price),
            currency: 'USD',
            rating: item.rating,
            ratingCount: item.ratingCount,
            categoryId: cat.id,
            category: cat,
            createdAt: item.createdAt,
            updatedAt: item.createdAt,
            images: [
              {
                id: currentId,
                productId: currentId,
                url: `/products/${item.slug}.jpg`,
                alt: `${item.title} - ${cat.name} product photo`,
                position: 0,
              },
            ],
          });
        }
      }
    }

    function filterProducts(list: typeof products, where?: any) {
      if (!where) return [...list];
      return list.filter((p) => {
        if (where.category?.slug?.in) {
          if (!where.category.slug.in.includes(p.category.slug)) return false;
        }
        if (where.price?.gte !== undefined) {
          if (p.price.toNumber() < where.price.gte) return false;
        }
        if (where.price?.lte !== undefined) {
          if (p.price.toNumber() > where.price.lte) return false;
        }
        if (where.rating?.gte !== undefined) {
          if (p.rating < where.rating.gte) return false;
        }
        if (where.OR) {
          const matches = where.OR.some((clause: any) => {
            if (clause.title?.contains) {
              return p.title.toLowerCase().includes(clause.title.contains.toLowerCase());
            }
            if (clause.description?.contains) {
              return p.description.toLowerCase().includes(clause.description.contains.toLowerCase());
            }
            return false;
          });
          if (!matches) return false;
        }
        return true;
      });
    }

    function sortProducts(list: typeof products, orderBy?: any[]) {
      if (!orderBy || !orderBy.length) return list;
      const sorted = [...list];
      sorted.sort((a, b) => {
        for (const rule of orderBy) {
          const key = Object.keys(rule)[0] as keyof typeof a;
          const dir = rule[key];
          const valA =
            key === 'price'
              ? a.price.toNumber()
              : key === 'createdAt'
                ? a.createdAt.getTime()
                : (a as any)[key];
          const valB =
            key === 'price'
              ? b.price.toNumber()
              : key === 'createdAt'
                ? b.createdAt.getTime()
                : (b as any)[key];

          if (valA < valB) return dir === 'asc' ? -1 : 1;
          if (valA > valB) return dir === 'asc' ? 1 : -1;
        }
        return 0;
      });
      return sorted;
    }

    this.inMemoryDb = {
      category: {
        findMany: async ({ orderBy }: { orderBy?: { name?: string } } = {}) => {
          const result = categories.map((c) => ({
            ...c,
            _count: { products: products.filter((p) => p.categoryId === c.id).length },
          }));
          if (orderBy?.name === 'asc') {
            result.sort((a, b) => a.name.localeCompare(b.name));
          }
          return result;
        },
      },
      product: {
        count: async ({ where }: { where?: any } = {}) => {
          return filterProducts(products, where).length;
        },
        findMany: async ({
          where,
          orderBy,
          skip = 0,
          take = 12,
        }: {
          where?: any;
          orderBy?: any;
          skip?: number;
          take?: number;
        } = {}) => {
          let list = filterProducts(products, where);
          list = sortProducts(list, orderBy);
          return list.slice(skip, skip + take);
        },
        findUnique: async ({ where }: { where: { id: number } }) => {
          return products.find((p) => p.id === where.id) || null;
        },
      },
      $transaction: async (promises: Promise<any>[]) => {
        return Promise.all(promises);
      },
    };

    Object.defineProperty(this, 'product', {
      get: () => this.inMemoryDb.product,
      configurable: true,
    });
    Object.defineProperty(this, 'category', {
      get: () => this.inMemoryDb.category,
      configurable: true,
    });
    (this as any).$transaction = (arg: any) => this.inMemoryDb.$transaction(arg);
  }
}
