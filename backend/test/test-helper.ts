import { execSync } from 'node:child_process';
import net from 'node:net';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient, Prisma } from '@prisma/client';
import { AppModule } from '../src/app.module.js';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter.js';
import { PrismaService } from '../src/prisma/prisma.service.js';

const FIXTURE_CATEGORIES = [
  { id: 1, slug: 'electronics', name: 'Electronics' },
  { id: 2, slug: 'mens-clothing', name: "Men's Clothing" },
  { id: 3, slug: 'jewelery', name: 'Jewelery' },
];

const FIXTURE_PRODUCTS = [
  // 5 Electronics
  {
    id: 1,
    slug: 'portable-ssd-drive',
    title: 'Portable SSD Drive',
    description: 'High speed portable solid state drive USB 3.2',
    price: new Prisma.Decimal(15.0),
    rating: 4.8,
    ratingCount: 300,
    categoryId: 1,
    createdAt: new Date('2026-09-01T00:00:00.000Z'),
    updatedAt: new Date('2026-09-01T00:00:00.000Z'),
    category: FIXTURE_CATEGORIES[0],
    images: [
      { id: 1, productId: 1, url: '/products/portable-ssd-drive.jpg', alt: 'SSD photo', position: 0 },
    ],
  },
  {
    id: 2,
    slug: 'wireless-gaming-mouse',
    title: 'Wireless Gaming Mouse',
    description: 'Ergonomic optical gaming mouse with rgb lighting',
    price: new Prisma.Decimal(20.0),
    rating: 4.6,
    ratingCount: 150,
    categoryId: 1,
    createdAt: new Date('2026-09-02T00:00:00.000Z'),
    updatedAt: new Date('2026-09-02T00:00:00.000Z'),
    category: FIXTURE_CATEGORIES[0],
    images: [
      { id: 2, productId: 2, url: '/products/wireless-gaming-mouse.jpg', alt: 'Mouse photo', position: 0 },
    ],
  },
  {
    id: 3,
    slug: 'mechanical-gaming-keyboard',
    title: 'Mechanical Gaming Keyboard',
    description: 'Tactile mechanical switches with backlit keys',
    price: new Prisma.Decimal(35.0),
    rating: 4.2,
    ratingCount: 200,
    categoryId: 1,
    createdAt: new Date('2026-09-03T00:00:00.000Z'),
    updatedAt: new Date('2026-09-03T00:00:00.000Z'),
    category: FIXTURE_CATEGORIES[0],
    images: [
      { id: 3, productId: 3, url: '/products/mechanical-gaming-keyboard.jpg', alt: 'Keyboard photo', position: 0 },
    ],
  },
  {
    id: 4,
    slug: 'curved-gaming-monitor',
    title: 'Curved Gaming Monitor',
    description: 'Ultra wide 144Hz refresh rate curved display',
    price: new Prisma.Decimal(60.0),
    rating: 4.9,
    ratingCount: 500,
    categoryId: 1,
    createdAt: new Date('2026-09-04T00:00:00.000Z'),
    updatedAt: new Date('2026-09-04T00:00:00.000Z'),
    category: FIXTURE_CATEGORIES[0],
    images: [
      { id: 4, productId: 4, url: '/products/curved-gaming-monitor.jpg', alt: 'Monitor photo', position: 0 },
    ],
  },
  {
    id: 5,
    slug: '4k-ultra-hd-display',
    title: '4K Ultra HD Display',
    description: 'Professional color accurate display for creators',
    price: new Prisma.Decimal(120.0),
    rating: 3.8,
    ratingCount: 90,
    categoryId: 1,
    createdAt: new Date('2026-09-05T00:00:00.000Z'),
    updatedAt: new Date('2026-09-05T00:00:00.000Z'),
    category: FIXTURE_CATEGORIES[0],
    images: [
      { id: 5, productId: 5, url: '/products/4k-ultra-hd-display.jpg', alt: 'Display photo', position: 0 },
    ],
  },

  // 5 Men's Clothing
  {
    id: 6,
    slug: 'mens-casual-slim-fit-t-shirt',
    title: 'Mens Casual Slim Fit T-Shirt',
    description: 'Breathable lightweight soft cotton casual tee',
    price: new Prisma.Decimal(25.0),
    rating: 4.5,
    ratingCount: 250,
    categoryId: 2,
    createdAt: new Date('2026-09-06T00:00:00.000Z'),
    updatedAt: new Date('2026-09-06T00:00:00.000Z'),
    category: FIXTURE_CATEGORIES[1],
    images: [
      { id: 6, productId: 6, url: '/products/mens-casual-slim-fit-t-shirt.jpg', alt: 'T-Shirt photo', position: 0 },
    ],
  },
  {
    id: 7,
    slug: 'mens-cotton-winter-jacket',
    title: 'Mens Cotton Winter Jacket',
    description: 'Warm windproof outerwear jacket for cold seasons',
    price: new Prisma.Decimal(45.0),
    rating: 4.7,
    ratingCount: 400,
    categoryId: 2,
    createdAt: new Date('2026-09-07T00:00:00.000Z'),
    updatedAt: new Date('2026-09-07T00:00:00.000Z'),
    category: FIXTURE_CATEGORIES[1],
    images: [
      { id: 7, productId: 7, url: '/products/mens-cotton-winter-jacket.jpg', alt: 'Jacket photo', position: 0 },
    ],
  },
  {
    id: 8,
    slug: 'mens-outdoor-fleece-jacket',
    title: 'Mens Outdoor Fleece Jacket',
    description: 'Comfortable thermal fleece jacket with zip pockets',
    price: new Prisma.Decimal(55.0),
    rating: 4.3,
    ratingCount: 120,
    categoryId: 2,
    createdAt: new Date('2026-09-08T00:00:00.000Z'),
    updatedAt: new Date('2026-09-08T00:00:00.000Z'),
    category: FIXTURE_CATEGORIES[1],
    images: [
      { id: 8, productId: 8, url: '/products/mens-outdoor-fleece-jacket.jpg', alt: 'Fleece photo', position: 0 },
    ],
  },
  {
    id: 9,
    slug: 'mens-formal-business-suit',
    title: 'Mens Formal Business Suit',
    description: 'Tailored slim cut two piece formal event suit',
    price: new Prisma.Decimal(60.0),
    rating: 4.1,
    ratingCount: 180,
    categoryId: 2,
    createdAt: new Date('2026-09-09T00:00:00.000Z'),
    updatedAt: new Date('2026-09-09T00:00:00.000Z'),
    category: FIXTURE_CATEGORIES[1],
    images: [
      { id: 9, productId: 9, url: '/products/mens-formal-business-suit.jpg', alt: 'Suit photo', position: 0 },
    ],
  },
  {
    id: 10,
    slug: 'mens-leather-biker-jacket',
    title: 'Mens Leather Biker Jacket',
    description: 'Classic vintage genuine leather motorcycle jacket',
    price: new Prisma.Decimal(85.0),
    rating: 4.0,
    ratingCount: 80,
    categoryId: 2,
    createdAt: new Date('2026-09-10T00:00:00.000Z'),
    updatedAt: new Date('2026-09-10T00:00:00.000Z'),
    category: FIXTURE_CATEGORIES[1],
    images: [
      { id: 10, productId: 10, url: '/products/mens-leather-biker-jacket.jpg', alt: 'Biker jacket photo', position: 0 },
    ],
  },

  // 5 Jewelery
  {
    id: 11,
    slug: 'silver-plated-ring-set',
    title: 'Silver Plated Ring Set',
    description: 'Bohemian stacking bands with polished silver finish',
    price: new Prisma.Decimal(10.0),
    rating: 4.4,
    ratingCount: 220,
    categoryId: 3,
    createdAt: new Date('2026-09-11T00:00:00.000Z'),
    updatedAt: new Date('2026-09-11T00:00:00.000Z'),
    category: FIXTURE_CATEGORIES[2],
    images: [
      { id: 11, productId: 11, url: '/products/silver-plated-ring-set.jpg', alt: 'Ring set photo', position: 0 },
    ],
  },
  {
    id: 12,
    slug: 'stainless-steel-pendant-necklace',
    title: 'Stainless Steel Pendant Necklace',
    description: 'Minimalist geometric pendant on durable curb chain',
    price: new Prisma.Decimal(20.0),
    rating: 4.6,
    ratingCount: 310,
    categoryId: 3,
    createdAt: new Date('2026-09-12T00:00:00.000Z'),
    updatedAt: new Date('2026-09-12T00:00:00.000Z'),
    category: FIXTURE_CATEGORIES[2],
    images: [
      { id: 12, productId: 12, url: '/products/stainless-steel-pendant-necklace.jpg', alt: 'Necklace photo', position: 0 },
    ],
  },
  {
    id: 13,
    slug: 'solid-gold-petite-micropave-ring',
    title: 'Solid Gold Petite Micropave Ring',
    description: 'Elegant 14k gold band set with pavé cubic zirconia',
    price: new Prisma.Decimal(50.0),
    rating: 4.8,
    ratingCount: 450,
    categoryId: 3,
    createdAt: new Date('2026-09-13T00:00:00.000Z'),
    updatedAt: new Date('2026-09-13T00:00:00.000Z'),
    category: FIXTURE_CATEGORIES[2],
    images: [
      { id: 13, productId: 13, url: '/products/solid-gold-petite-micropave-ring.jpg', alt: 'Gold ring photo', position: 0 },
    ],
  },
  {
    id: 14,
    slug: 'diamond-solitaire-stud-earrings',
    title: 'Diamond Solitaire Stud Earrings',
    description: 'Brilliant round cut simulated diamond studs in 4-prong setting',
    price: new Prisma.Decimal(95.0),
    rating: 4.2,
    ratingCount: 110,
    categoryId: 3,
    createdAt: new Date('2026-09-14T00:00:00.000Z'),
    updatedAt: new Date('2026-09-14T00:00:00.000Z'),
    category: FIXTURE_CATEGORIES[2],
    images: [
      { id: 14, productId: 14, url: '/products/diamond-solitaire-stud-earrings.jpg', alt: 'Earrings photo', position: 0 },
    ],
  },
  {
    id: 15,
    slug: 'luxury-white-gold-tennis-bracelet',
    title: 'Luxury White Gold Tennis Bracelet',
    description: 'Timeless sparkle with secure double safety box clasp',
    price: new Prisma.Decimal(150.0),
    rating: 5.0,
    ratingCount: 600,
    categoryId: 3,
    createdAt: new Date('2026-09-15T00:00:00.000Z'),
    updatedAt: new Date('2026-09-15T00:00:00.000Z'),
    category: FIXTURE_CATEGORIES[2],
    images: [
      { id: 15, productId: 15, url: '/products/luxury-white-gold-tennis-bracelet.jpg', alt: 'Bracelet photo', position: 0 },
    ],
  },
];

async function checkTcpPort(host: string, port: number, timeout = 800): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(timeout);
    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.on('error', () => {
      resolve(false);
    });
    socket.connect(port, host);
  });
}

function createInMemoryPrisma() {
  const categories = FIXTURE_CATEGORIES.map((c) => ({ ...c }));
  const products = FIXTURE_PRODUCTS.map((p) => ({ ...p }));

  function filter(list: typeof products, where?: any) {
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

  function sort(list: typeof products, orderBy?: any[]) {
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

  return {
    $connect: async () => {},
    $disconnect: async () => {},
    $executeRawUnsafe: async () => 0,
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
        return filter(products, where).length;
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
        let list = filter(products, where);
        list = sort(list, orderBy);
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
}

export interface E2ETestContext {
  app: INestApplication;
  prisma: any;
  cleanup: () => Promise<void>;
}

export async function createE2ETestContext(): Promise<E2ETestContext> {
  const testDbUrl =
    process.env.DATABASE_URL_TEST ||
    'postgresql://postgres:postgres@localhost:5432/plp_test?schema=public';

  const isDbPortOpen = await checkTcpPort('localhost', 5432, 500);

  let activePrisma: any = null;
  let isRealDb = false;

  if (isDbPortOpen) {
    try {
      // Apply migrations and seed fixture
      execSync('npx prisma migrate deploy', {
        env: { ...process.env, DATABASE_URL: testDbUrl },
        stdio: 'ignore',
      });

      const realPrisma = new PrismaClient({
        datasources: { db: { url: testDbUrl } },
      });
      await realPrisma.$connect();

      // Seed fixture into real PostgreSQL
      await realPrisma.$executeRawUnsafe(
        'TRUNCATE TABLE "ProductImage", "Product", "Category" CASCADE;',
      );

      for (const cat of FIXTURE_CATEGORIES) {
        await realPrisma.category.create({
          data: { id: cat.id, slug: cat.slug, name: cat.name },
        });
      }

      for (const prod of FIXTURE_PRODUCTS) {
        await realPrisma.product.create({
          data: {
            id: prod.id,
            slug: prod.slug,
            title: prod.title,
            description: prod.description,
            price: prod.price,
            rating: prod.rating,
            ratingCount: prod.ratingCount,
            categoryId: prod.categoryId,
            createdAt: prod.createdAt,
            updatedAt: prod.updatedAt,
            images: {
              create: prod.images.map((img) => ({
                url: img.url,
                alt: img.alt,
                position: img.position,
              })),
            },
          },
        });
      }

      activePrisma = realPrisma;
      isRealDb = true;
    } catch {
      activePrisma = createInMemoryPrisma();
    }
  } else {
    activePrisma = createInMemoryPrisma();
  }

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(PrismaService)
    .useValue(activePrisma)
    .compile();

  const app = moduleFixture.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.init();

  const cleanup = async () => {
    if (isRealDb && activePrisma) {
      try {
        await activePrisma.$executeRawUnsafe(
          'TRUNCATE TABLE "ProductImage", "Product", "Category" CASCADE;',
        );
        await activePrisma.$disconnect();
      } catch {
        // ignore disconnect errors
      }
    }
    await app.close();
  };

  return {
    app,
    prisma: activePrisma,
    cleanup,
  };
}
