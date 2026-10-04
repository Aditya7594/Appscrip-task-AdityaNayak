# Dependencies

| Package | Where (frontend/backend) | Why |
| :--- | :--- | :--- |
| @nestjs/config | backend | Provides typed environment configuration management and validation for NestJS |
| @nestjs/swagger | backend | Generates OpenAPI specification and interactive Swagger UI documentation at /docs |
| class-validator | backend | Decorator-based input and DTO validation used by NestJS ValidationPipe |
| class-transformer | backend | Transforms plain objects to class instances and handles implicit type conversions |
| @prisma/client | backend | Auto-generated, type-safe database client for PostgreSQL operations |
| prisma | backend | Database toolkit and migration engine for schema definition and migrations |
| tsx | backend | TypeScript execution runtime for running image download and seed scripts directly |
| server-only | frontend | Ensures server-only data fetching code and API client modules cannot be bundled into client components |
| vitest | frontend | Fast unit test runner for validating pure URL parsing, query transformation, and state helpers |
| @playwright/test | frontend | Official browser automation and end-to-end testing framework for verifying SSR, responsive layouts, and interactive filtering/sorting |

