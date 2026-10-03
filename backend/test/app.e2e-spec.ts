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
