import request from 'supertest';
import { createE2ETestContext, E2ETestContext } from './test-helper.js';

describe('Categories (e2e)', () => {
  let ctx: E2ETestContext;

  beforeAll(async () => {
    ctx = await createE2ETestContext();
  });

  afterAll(async () => {
    await ctx.cleanup();
  });

  it('/categories (GET) returns categories ordered by name asc with accurate productCount and cache header', async () => {
    const response = await request(ctx.app.getHttpServer()).get('/categories').expect(200);

    expect(response.headers['cache-control']).toBe('public, max-age=60');
    expect(response.body).toEqual([
      {
        id: 1,
        slug: 'electronics',
        name: 'Electronics',
        productCount: 5,
      },
      {
        id: 3,
        slug: 'jewelery',
        name: 'Jewelery',
        productCount: 5,
      },
      {
        id: 2,
        slug: 'mens-clothing',
        name: "Men's Clothing",
        productCount: 5,
      },
    ]);
  });
});
