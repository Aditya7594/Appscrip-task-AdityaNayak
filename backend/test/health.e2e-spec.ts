import request from 'supertest';
import { createE2ETestContext, E2ETestContext } from './test-helper.js';

describe('Health (e2e)', () => {
  let ctx: E2ETestContext;

  beforeAll(async () => {
    ctx = await createE2ETestContext();
  });

  afterAll(async () => {
    await ctx.cleanup();
  });

  it('/health (GET) returns status ok, uptime number, and ISO timestamp', async () => {
    const response = await request(ctx.app.getHttpServer()).get('/health').expect(200);

    expect(response.body).toEqual({
      status: 'ok',
      uptime: expect.any(Number),
      timestamp: expect.any(String),
    });
    expect(response.body.uptime).toBeGreaterThanOrEqual(0);
    expect(new Date(response.body.timestamp).toISOString()).toBe(response.body.timestamp);
  });

  it('/nonexistent (GET) returns 404 with standard error shape', async () => {
    const response = await request(ctx.app.getHttpServer()).get('/nonexistent').expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      error: 'Not Found',
      message: 'Cannot GET /nonexistent',
      path: '/nonexistent',
      timestamp: expect.any(String),
    });
  });
});
