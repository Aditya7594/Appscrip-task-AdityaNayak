import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';
import { HttpExceptionFilter } from './../src/common/filters/http-exception.filter.js';
import { PrismaService } from './../src/prisma/prisma.service.js';

describe('App (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        $connect: vitest.fn().mockResolvedValue(undefined),
        $disconnect: vitest.fn().mockResolvedValue(undefined),
        $transaction: vitest.fn().mockImplementation((promises: Promise<unknown>[]) => Promise.all(promises)),
        product: {
          count: vitest.fn().mockResolvedValue(60),
          findMany: vitest.fn().mockResolvedValue([
            {
              id: 1,
              slug: 'mens-cotton-jacket',
              title: "Men's Cotton Jacket",
              description: 'Great outerwear jackets for Spring/Autumn/Winter.',
              price: { toNumber: () => 55.99 },
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
                  id: 1,
                  productId: 1,
                  url: '/products/mens-cotton-jacket.jpg',
                  alt: "Men's Cotton Jacket photo",
                  position: 0,
                },
              ],
            },
          ]),
          findUnique: vitest.fn().mockImplementation(({ where }: { where: { id: number } }) => {
            if (where.id === 1) {
              return Promise.resolve({
                id: 1,
                slug: 'mens-cotton-jacket',
                title: "Men's Cotton Jacket",
                description: 'Great outerwear jackets for Spring/Autumn/Winter.',
                price: { toNumber: () => 55.99 },
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
                    id: 1,
                    productId: 1,
                    url: '/products/mens-cotton-jacket.jpg',
                    alt: "Men's Cotton Jacket photo",
                    position: 0,
                  },
                ],
              });
            }
            return Promise.resolve(null);
          }),
        },
        category: {
          findMany: vitest.fn().mockResolvedValue([
            {
              id: 1,
              slug: 'electronics',
              name: 'Electronics',
              _count: { products: 6 },
            },
          ]),
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
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
  });

  afterEach(async () => {
    await app.close();
  });

  it('/health (GET) returns status, uptime, timestamp', async () => {
    const response = await request(app.getHttpServer()).get('/health').expect(200);

    expect(response.body).toHaveProperty('status', 'ok');
    expect(typeof response.body.uptime).toBe('number');
    expect(typeof response.body.timestamp).toBe('string');
  });

  it('/categories (GET) returns categories array with Cache-Control header', async () => {
    const response = await request(app.getHttpServer()).get('/categories').expect(200);

    expect(response.headers['cache-control']).toBe('public, max-age=60');
    expect(response.body).toEqual([
      {
        id: 1,
        slug: 'electronics',
        name: 'Electronics',
        productCount: 6,
      },
    ]);
  });

  it('/products (GET) returns paginated products with default meta', async () => {
    const response = await request(app.getHttpServer()).get('/products').expect(200);

    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('meta');
    expect(response.body.meta).toEqual({
      page: 1,
      limit: 12,
      total: 60,
      totalPages: 5,
      hasNextPage: true,
      hasPreviousPage: false,
    });
    expect(response.body.data[0]).toMatchObject({
      id: 1,
      slug: 'mens-cotton-jacket',
      price: 55.99,
      currency: 'USD',
      rating: 4.7,
      category: {
        slug: 'mens-clothing',
      },
    });
  });

  it('/products?limit=100 (GET) returns 400 for limit exceeding max', async () => {
    const response = await request(app.getHttpServer()).get('/products?limit=100').expect(400);

    expect(response.body.statusCode).toBe(400);
    expect(response.body.error).toBe('Bad Request');
    expect(response.body.message).toContain('limit must not be greater than 48');
  });

  it('/products?minPrice=50&maxPrice=10 (GET) returns 400 for minPrice > maxPrice', async () => {
    const response = await request(app.getHttpServer())
      .get('/products?minPrice=50&maxPrice=10')
      .expect(400);

    expect(response.body.statusCode).toBe(400);
    expect(response.body.error).toBe('Bad Request');
    expect(response.body.message).toContain('minPrice must be less than or equal to maxPrice');
  });

  it('/products?sort=bogus (GET) returns 400 for invalid sort enum', async () => {
    const response = await request(app.getHttpServer()).get('/products?sort=bogus').expect(400);

    expect(response.body.statusCode).toBe(400);
    expect(response.body.error).toBe('Bad Request');
    expect(response.body.message).toContain(
      'sort must be one of: recommended, newest, popular, price_asc, price_desc',
    );
  });

  it('/products/1 (GET) returns 200 with product details', async () => {
    const response = await request(app.getHttpServer()).get('/products/1').expect(200);

    expect(response.body).toEqual({
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
          alt: "Men's Cotton Jacket photo",
          position: 0,
        },
      ],
      createdAt: '2026-10-01T00:00:00.000Z',
    });
  });

  it('/products/abc (GET) returns 400 for non-integer id with standard error shape', async () => {
    const response = await request(app.getHttpServer()).get('/products/abc').expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Validation failed (numeric string is expected)',
      path: '/products/abc',
      timestamp: expect.any(String),
    });
  });

  it('/products/99999 (GET) returns 404 for missing product with standard error shape', async () => {
    const response = await request(app.getHttpServer()).get('/products/99999').expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      error: 'Not Found',
      message: 'Product 99999 not found',
      path: '/products/99999',
      timestamp: expect.any(String),
    });
  });

  it('/nope (GET) returns 404 with standard error shape', async () => {
    const response = await request(app.getHttpServer()).get('/nope').expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      error: 'Not Found',
      message: 'Cannot GET /nope',
      path: '/nope',
      timestamp: expect.any(String),
    });
  });

  it('/nonexistent (GET) returns 404 with standard error shape', async () => {
    const response = await request(app.getHttpServer()).get('/nonexistent').expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      error: 'Not Found',
      message: 'Cannot GET /nonexistent',
      path: '/nonexistent',
      timestamp: expect.any(String),
    });
  });
});
