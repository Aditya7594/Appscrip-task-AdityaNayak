import request from 'supertest';
import { createE2ETestContext, E2ETestContext } from './test-helper.js';

describe('Products (e2e)', () => {
  let ctx: E2ETestContext;

  beforeAll(async () => {
    ctx = await createE2ETestContext();
  });

  afterAll(async () => {
    await ctx.cleanup();
  });

  function assertStandardErrorShape(body: any, expectedStatus: number, expectedPathSnippet: string) {
    expect(body).toEqual({
      statusCode: expectedStatus,
      error: expect.any(String),
      message: expect.anything(),
      path: expect.stringContaining(expectedPathSnippet),
      timestamp: expect.any(String),
    });
    expect(new Date(body.timestamp).toISOString()).toBe(body.timestamp);
  }

  describe('GET /products (Listing, Pagination, Filtering, Sorting)', () => {
    it('returns default response shape and pagination meta (limit 18, total 15)', async () => {
      const response = await request(ctx.app.getHttpServer()).get('/products').expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('meta');
      expect(response.body.data).toHaveLength(15);
      expect(response.body.meta).toEqual({
        page: 1,
        limit: 18,
        total: 15,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      });

      const first = response.body.data[0];
      expect(first).toEqual({
        id: expect.any(Number),
        slug: expect.any(String),
        title: expect.any(String),
        description: expect.any(String),
        price: expect.any(Number),
        currency: 'USD',
        rating: expect.any(Number),
        ratingCount: expect.any(Number),
        category: {
          id: expect.any(Number),
          slug: expect.any(String),
          name: expect.any(String),
        },
        images: expect.arrayContaining([
          expect.objectContaining({
            url: expect.any(String),
            alt: expect.any(String),
            position: expect.any(Number),
          }),
        ]),
        createdAt: expect.any(String),
      });
    });

    it('returns page 2 with limit 5 having different ids and correct meta', async () => {
      const page1Res = await request(ctx.app.getHttpServer())
        .get('/products?page=1&limit=5')
        .expect(200);
      const page2Res = await request(ctx.app.getHttpServer())
        .get('/products?page=2&limit=5')
        .expect(200);

      expect(page1Res.body.data).toHaveLength(5);
      expect(page2Res.body.data).toHaveLength(5);

      const page1Ids = page1Res.body.data.map((p: any) => p.id);
      const page2Ids = page2Res.body.data.map((p: any) => p.id);

      // Verify page 2 has completely distinct IDs from page 1
      const commonIds = page1Ids.filter((id: number) => page2Ids.includes(id));
      expect(commonIds).toHaveLength(0);

      expect(page2Res.body.meta).toEqual({
        page: 2,
        limit: 5,
        total: 15,
        totalPages: 3,
        hasNextPage: true,
        hasPreviousPage: true,
      });
    });

    it('returns 200 + empty data array when page is beyond totalPages', async () => {
      const response = await request(ctx.app.getHttpServer())
        .get('/products?page=10&limit=5')
        .expect(200);

      expect(response.body.data).toEqual([]);
      expect(response.body.meta).toEqual({
        page: 10,
        limit: 5,
        total: 15,
        totalPages: 3,
        hasNextPage: false,
        hasPreviousPage: true,
      });
    });

    it('filters by one category slug (?category=electronics)', async () => {
      const response = await request(ctx.app.getHttpServer())
        .get('/products?category=electronics')
        .expect(200);

      expect(response.body.data).toHaveLength(5);
      expect(response.body.meta.total).toBe(5);
      for (const item of response.body.data) {
        expect(item.category.slug).toBe('electronics');
      }
    });

    it('filters by two category slugs (?category=electronics,jewelery)', async () => {
      const response = await request(ctx.app.getHttpServer())
        .get('/products?category=electronics,jewelery')
        .expect(200);

      expect(response.body.data).toHaveLength(10);
      expect(response.body.meta.total).toBe(10);
      for (const item of response.body.data) {
        expect(['electronics', 'jewelery']).toContain(item.category.slug);
      }
    });

    it('filters by price range with inclusive bounds (?minPrice=20&maxPrice=60)', async () => {
      const response = await request(ctx.app.getHttpServer())
        .get('/products?minPrice=20&maxPrice=60&limit=48')
        .expect(200);

      expect(response.body.data.length).toBeGreaterThan(0);
      const prices = response.body.data.map((p: any) => p.price);
      for (const price of prices) {
        expect(price).toBeGreaterThanOrEqual(20);
        expect(price).toBeLessThanOrEqual(60);
      }

      // Verifies exact inclusive boundary matches
      expect(prices).toContain(20);
      expect(prices).toContain(60);
    });

    it('filters by minRating (?minRating=4.8)', async () => {
      const response = await request(ctx.app.getHttpServer())
        .get('/products?minRating=4.8')
        .expect(200);

      expect(response.body.data.length).toBeGreaterThan(0);
      for (const item of response.body.data) {
        expect(item.rating).toBeGreaterThanOrEqual(4.8);
      }
    });

    it('searches title case-insensitively (?q=jacket and ?q=JACKET)', async () => {
      const lowerRes = await request(ctx.app.getHttpServer())
        .get('/products?q=jacket')
        .expect(200);
      const upperRes = await request(ctx.app.getHttpServer())
        .get('/products?q=JACKET')
        .expect(200);

      expect(lowerRes.body.data.length).toBeGreaterThan(0);
      expect(lowerRes.body.data).toEqual(upperRes.body.data);
      for (const item of lowerRes.body.data) {
        const matches =
          item.title.toLowerCase().includes('jacket') ||
          item.description.toLowerCase().includes('jacket');
        expect(matches).toBe(true);
      }
    });

    describe('Sort orders (5 options with stable id tie-breakers)', () => {
      it('verifies sort=recommended (rating desc, ratingCount desc, id asc)', async () => {
        const response = await request(ctx.app.getHttpServer())
          .get('/products?sort=recommended&limit=15')
          .expect(200);

        const items = response.body.data;
        for (let i = 0; i < items.length - 1; i++) {
          const a = items[i];
          const b = items[i + 1];
          if (a.rating !== b.rating) {
            expect(a.rating).toBeGreaterThan(b.rating);
          } else if (a.ratingCount !== b.ratingCount) {
            expect(a.ratingCount).toBeGreaterThan(b.ratingCount);
          } else {
            expect(a.id).toBeLessThan(b.id);
          }
        }
      });

      it('verifies sort=newest (createdAt desc, id desc)', async () => {
        const response = await request(ctx.app.getHttpServer())
          .get('/products?sort=newest&limit=15')
          .expect(200);

        const items = response.body.data;
        for (let i = 0; i < items.length - 1; i++) {
          const timeA = new Date(items[i].createdAt).getTime();
          const timeB = new Date(items[i + 1].createdAt).getTime();
          if (timeA !== timeB) {
            expect(timeA).toBeGreaterThan(timeB);
          } else {
            expect(items[i].id).toBeGreaterThan(items[i + 1].id);
          }
        }
      });

      it('verifies sort=popular (ratingCount desc, id asc)', async () => {
        const response = await request(ctx.app.getHttpServer())
          .get('/products?sort=popular&limit=15')
          .expect(200);

        const items = response.body.data;
        for (let i = 0; i < items.length - 1; i++) {
          const a = items[i];
          const b = items[i + 1];
          if (a.ratingCount !== b.ratingCount) {
            expect(a.ratingCount).toBeGreaterThan(b.ratingCount);
          } else {
            expect(a.id).toBeLessThan(b.id);
          }
        }
      });

      it('verifies sort=price_asc (price asc, id asc)', async () => {
        const response = await request(ctx.app.getHttpServer())
          .get('/products?sort=price_asc&limit=15')
          .expect(200);

        const items = response.body.data;
        for (let i = 0; i < items.length - 1; i++) {
          const a = items[i];
          const b = items[i + 1];
          if (a.price !== b.price) {
            expect(a.price).toBeLessThan(b.price);
          } else {
            expect(a.id).toBeLessThan(b.id);
          }
        }
      });

      it('verifies sort=price_desc (price desc, id desc)', async () => {
        const response = await request(ctx.app.getHttpServer())
          .get('/products?sort=price_desc&limit=15')
          .expect(200);

        const items = response.body.data;
        for (let i = 0; i < items.length - 1; i++) {
          const a = items[i];
          const b = items[i + 1];
          if (a.price !== b.price) {
            expect(a.price).toBeGreaterThan(b.price);
          } else {
            expect(a.id).toBeGreaterThan(b.id);
          }
        }
      });
    });

    describe('Validation errors (400) assert standard error shape', () => {
      it('returns 400 when minPrice > maxPrice', async () => {
        const response = await request(ctx.app.getHttpServer())
          .get('/products?minPrice=50&maxPrice=10')
          .expect(400);

        assertStandardErrorShape(response.body, 400, '/products');
        expect(response.body.message).toContain('minPrice must be less than or equal to maxPrice');
      });

      it('returns 400 when limit > 48 (limit=100)', async () => {
        const response = await request(ctx.app.getHttpServer())
          .get('/products?limit=100')
          .expect(400);

        assertStandardErrorShape(response.body, 400, '/products');
        expect(response.body.message).toContain('limit must not be greater than 48');
      });

      it('returns 400 when sort is invalid (sort=bogus)', async () => {
        const response = await request(ctx.app.getHttpServer())
          .get('/products?sort=bogus')
          .expect(400);

        assertStandardErrorShape(response.body, 400, '/products');
        expect(response.body.message).toContain(
          'sort must be one of: recommended, newest, popular, price_asc, price_desc',
        );
      });

      it('returns 400 when unknown parameter is passed (forbidNonWhitelisted)', async () => {
        const response = await request(ctx.app.getHttpServer())
          .get('/products?unknownParam=invalidValue')
          .expect(400);

        assertStandardErrorShape(response.body, 400, '/products');
        expect(response.body.message).toEqual(
          expect.arrayContaining([expect.stringContaining('property unknownParam should not exist')]),
        );
      });
    });
  });

  describe('GET /products/:id', () => {
    it('returns 200 with product details when product exists', async () => {
      const response = await request(ctx.app.getHttpServer())
        .get('/products/1')
        .expect(200);

      expect(response.body).toEqual({
        id: 1,
        slug: 'portable-ssd-drive',
        title: 'Portable SSD Drive',
        description: 'High speed portable solid state drive USB 3.2',
        price: 15.0,
        currency: 'USD',
        rating: 4.8,
        ratingCount: 300,
        category: {
          id: 1,
          slug: 'electronics',
          name: 'Electronics',
        },
        images: [
          {
            url: '/products/portable-ssd-drive.jpg',
            alt: 'SSD photo',
            position: 0,
          },
        ],
        createdAt: '2026-09-01T00:00:00.000Z',
      });
    });

    it('returns 404 with standard error shape when product does not exist', async () => {
      const response = await request(ctx.app.getHttpServer())
        .get('/products/99999')
        .expect(404);

      assertStandardErrorShape(response.body, 404, '/products/99999');
      expect(response.body.message).toBe('Product 99999 not found');
    });

    it('returns 400 with standard error shape when id is non-integer (abc)', async () => {
      const response = await request(ctx.app.getHttpServer())
        .get('/products/abc')
        .expect(400);

      assertStandardErrorShape(response.body, 400, '/products/abc');
      expect(response.body.message).toBe('Validation failed (numeric string is expected)');
    });
  });
});
