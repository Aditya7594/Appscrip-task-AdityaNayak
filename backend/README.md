<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Error handling & status codes

All error responses returned by the API strictly adhere to the unified schema `{ statusCode, error, message, path, timestamp }`:

| Case | Status | Example response |
| :--- | :---: | :--- |
| **Validation error** (`/products?limit=100`) | 400 | `{"statusCode": 400, "error": "Bad Request", "message": ["limit must not be greater than 48"], "path": "/products?limit=100", "timestamp": "2026-10-03T16:00:00.000Z"}` |
| **Invalid identifier type** (`/products/abc`) | 400 | `{"statusCode": 400, "error": "Bad Request", "message": "Validation failed (numeric string is expected)", "path": "/products/abc", "timestamp": "2026-10-03T16:00:00.000Z"}` |
| **Product not found** (`/products/99999`) | 404 | `{"statusCode": 404, "error": "Not Found", "message": "Product 99999 not found", "path": "/products/99999", "timestamp": "2026-10-03T16:00:00.000Z"}` |
| **Unknown route** (`/nope`) | 404 | `{"statusCode": 404, "error": "Not Found", "message": "Cannot GET /nope", "path": "/nope", "timestamp": "2026-10-03T16:00:00.000Z"}` |
| **Prisma / unexpected error** | 500 | `{"statusCode": 500, "error": "Internal Server Error", "message": "Internal server error", "path": "/products", "timestamp": "2026-10-03T16:00:00.000Z"}` |

## Seed data

The database seed (`npm run seed` or `npx prisma db seed`) populates 4 categories and 60 products with images:
- **Base products:** 20 products sourced from the FakeStore API snapshot (`prisma/data/fakestore-products.json`).
- **Variants:** 40 product variants (2 per base product: `- Midnight` and `- Sand`) are deterministically generated demo data with pseudo-random pricing (+/-15%), jittered ratings, staggered creation timestamps, and matching image assets in `frontend/public/products/`.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

The test suite consists of unit tests (services, mappers, query validation, sort ordering) and end-to-end (e2e) tests for `/products`, `/categories`, and `/health`.

### Test database setup (`docker compose`)

E2E tests target a dedicated test database named `plp_test` configured via `DATABASE_URL_TEST` (see `.env.test.example` committed without secrets):

```bash
# 1. Start PostgreSQL
$ docker compose up -d

# 2. Run unit tests
$ npm test

# 3. Run e2e tests
$ npm run test:e2e

# 4. Run test coverage
$ npm run test:cov
```

**E2E Lifecycle:**
- In `beforeAll`, migrations are applied via `prisma migrate deploy`, and a deterministic fixture (3 categories: `electronics`, `mens-clothing`, `jewelery`; 15 products with verified prices, ratings, and creation dates) is inserted.
- In `afterAll`, tables are truncated (`TRUNCATE TABLE "ProductImage", "Product", "Category" CASCADE;`) and the connection is closed.
- If executed in an environment without Docker, the test harness transparently falls back to an in-memory repository with the identical fixture, ensuring 100% deterministic test execution.

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Observability

In production applications, observability is essential for understanding how your system behaves, detecting issues early, and maintaining reliable performance.

[NestJS Observe](https://observe.nestjs.com) automatically instruments your NestJS application, giving you deep visibility into your system with minimal setup:

- **Distributed tracing:** Follow requests across services and understand how they flow through your system.
- **Waterfall analysis:** Visualize request execution and identify slow operations, bottlenecks, and unexpected delays.
- **Performance analysis:** Analyze application performance in real time and quickly pinpoint areas that need optimization.
- **Metrics:** Track key application and infrastructure metrics to understand system health and performance trends.
- **Logging:** Centralize and correlate logs with traces and other telemetry to make debugging easier.
- **Error tracking:** Detect errors quickly and investigate their root causes with the surrounding context.
- **SLA monitoring:** Track service-level objectives and identify when your application is approaching or exceeding defined thresholds.
- **Alarms and alerts:** Set up alerts for critical errors, performance degradation, SLA violations, and other anomalies so your team can react quickly.

To add it to this project:

```bash
$ npm install @nestjs/observe
```

Then follow the [setup guide](https://docs.nestjs.com/observability/overview) - it takes a single import and an app key.

The free plan needs no payment details and covers 300,000 events a month. You can also browse the [live demo](https://www.observe-demo.nestjs.com/dashboard) first - the whole dashboard over a busy service's data, with nothing to install.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Auto-instrument your application with [NestJS Observe](https://observe.nestjs.com). Distributed tracing, metrics, and logging made easy. Error tracking and performance monitoring for your NestJS applications.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
