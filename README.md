# mettā muse - Product Listing Page (PLP)

A production-grade, pixel-perfect e-commerce Product Listing Page (PLP) featuring server-side rendering (SSR), dynamic filtering, faceted navigation, sorting, crawlable numbered pagination, responsive layouts, accessibility compliance (WCAG 2.1 AA), and search engine optimization (SEO).

---

## 1. Live URLs

- **GitHub Repository**: [https://github.com/Aditya7594/Appscrip-task-AdityaNayak](https://github.com/Aditya7594/Appscrip-task-AdityaNayak)
- **Live Frontend (Netlify)**: [https://appscrip-task-adityanayak.netlify.app](https://appscrip-task-adityanayak.netlify.app)
- **Live REST API (Render)**: [https://appscrip-task-adityanayak.onrender.com](https://appscrip-task-adityanayak.onrender.com)
- **Live OpenAPI / Swagger Docs**: [https://appscrip-task-adityanayak.onrender.com/docs](https://appscrip-task-adityanayak.onrender.com/docs)
- **API Health Endpoint**: [https://appscrip-task-adityanayak.onrender.com/health](https://appscrip-task-adityanayak.onrender.com/health)

---

## 2. Tech Stack and Rationale

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 16 (App Router) + React 19** | Industry standard for production SSR, streaming hydration, and metadata generation. Enables instant server rendering of initial products for web crawlers and zero-CLS page loads. |
| **Styling Architecture** | **Vanilla CSS Modules + Design Tokens** | Pure CSS modules with zero runtime overhead or CSS framework dependencies. Provides complete, pixel-level fidelity matching Figma specification tokens without external utility bloat. |
| **Typography** | **next/font (Self-hosted Google Fonts)** | Zero layout shift font delivery using *Barlow* (for Simplon Norm UI), *Libre Caslon Text* (for Adobe Caslon Pro serif accents), and *Inter* (for the LOGO wordmark) behind CSS custom properties. |
| **Backend API** | **NestJS 12 + Express** | Enterprise TypeScript architecture featuring dependency injection, modular domain separation (`products`, `categories`, `health`), validation pipes (`class-validator`), and automated OpenAPI documentation (`@nestjs/swagger`). |
| **Database & ORM** | **PostgreSQL (Neon) + Prisma ORM 6** | Modern serverless PostgreSQL with connection pooling (`PgBouncer`) and full `pg_trgm` extension support for trigram fuzzy search. Prisma provides end-to-end type safety, deterministic migrations, and optimized queries. |
| **Testing Suite** | **Playwright + Vitest** | Vitest for ultra-fast pure URL and state helper unit tests (< 1s); Playwright for end-to-end browser automation validating raw SSR HTML, responsive viewports, and interactive filters. |

---

## 3. Local Setup Instructions

### Prerequisites
- Node.js v20+ and npm installed
- PostgreSQL database (or Docker)

### 1. Clone Repository
```bash
git clone https://github.com/Aditya7594/Appscrip-task-AdityaNayak.git
cd Appscrip-task-AdityaNayak
```

### 2. Backend Setup
```bash
cd backend
cp .env.example .env
# Update DATABASE_URL in .env with your PostgreSQL credentials
npm install
npm run prisma:generate
npm run prisma:deploy
npm run seed              # Seeds 4 categories and 60 products
npm run start:dev         # Runs on http://localhost:4000
```
*Note: If local PostgreSQL is unavailable, `PrismaService` features an automatic zero-dependency in-memory fallback store loaded with all 60 seeded products.*

### 3. Frontend Setup
```bash
cd ../frontend
cp .env.example .env.local
npm install
npm run dev               # Runs on http://localhost:3000
```

### 4. Running Verification & Tests
- **Frontend Unit Tests**: `npm run test` (in `/frontend`)
- **Frontend E2E Tests**: `npm run e2e` (in `/frontend`)
- **Backend Tests**: `npm test` (in `/backend`)
- **Linting**: `npm run lint` (in `/frontend` and `/backend`)

---

## 4. Architecture Overview & Folder Structure

```
Appscrip-task-AdityaNayak/
├── backend/                        # NestJS REST API
│   ├── prisma/                     # Prisma schema, migrations, and seed script
│   │   ├── migrations/             # SQL migrations (including pg_trgm trigram index)
│   │   ├── schema.prisma           # Category, Product, ProductImage data models
│   │   └── seed.ts                 # Database seeder (60 products, 4 categories)
│   ├── src/
│   │   ├── categories/             # Category domain (controller, service, dto)
│   │   ├── common/                 # Global filters, decorators, and slug utilities
│   │   ├── health/                 # Health check endpoint (/health)
│   │   ├── prisma/                 # Prisma service with in-memory resilient fallback
│   │   ├── products/               # Product catalog, sorting, filtering, and DTOs
│   │   ├── app.module.ts           # Root application module
│   │   └── main.ts                 # Bootstrap, CORS config, Swagger setup
│   └── test/                       # Unit and integration test suites
│
├── frontend/                       # Next.js 16 App Router
│   ├── e2e/                        # Playwright end-to-end test suites
│   │   ├── filters-sort-pagination.spec.ts
│   │   ├── responsive.spec.ts
│   │   └── ssr.spec.ts
│   ├── public/                     # Static assets & 60 optimized product photos
│   │   └── products/               # High-res product images (3:4 ratio)
│   ├── src/
│   │   ├── app/
│   │   │   ├── products/           # SSR PLP route (/products) & loading/error boundaries
│   │   │   ├── layout.tsx          # Root HTML layout with fonts and skip link
│   │   │   ├── icon.svg            # SVG favicon
│   │   │   ├── robots.ts           # Dynamic robots.txt
│   │   │   └── sitemap.ts          # XML sitemap generator
│   │   ├── components/
│   │   │   ├── layout/             # Header, Footer, MobileMenu, Breadcrumb
│   │   │   ├── plp/                # ProductCard, Grid, Toolbar, Filters, Pagination
│   │   │   ├── seo/                # JsonLd structured data component
│   │   │   └── ui/                 # Accessible Checkbox, Icons
│   │   ├── lib/
│   │   │   ├── api/                # API client with cold-start retry and error handling
│   │   │   ├── seo/                # Canonical URL, metadata, and JSON-LD builders
│   │   │   └── url/                # URL query synchronization and pagination helpers
│   │   └── types/                  # TypeScript domain interfaces
│   └── playwright.config.ts        # Playwright test configuration
│
├── docs/                           # Project Documentation
│   ├── AI_LOG.md                   # Systematic AI usage and correction log
│   ├── DEPENDENCIES.md             # Justification matrix for all third-party packages
│   ├── DEPLOYMENT.md               # Production deployment guide (Neon, Render, Vercel)
│   ├── DESIGN_SPEC.md              # Figma token extract and design specification
│   ├── DESIGN_QA.md                # 13-area visual QA audit against Figma nodes
│   └── PERFORMANCE.md              # Lighthouse Core Web Vitals and bundle audit
└── render.yaml                     # Render Infrastructure-as-Code Blueprint
```

---

## 5. API Endpoints

Interactive documentation with live request testing is available at `/docs` (Swagger UI).

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Service uptime and heartbeat status |
| `GET` | `/categories` | List all product categories with dynamic item counts |
| `GET` | `/products` | Paginated product listing with filtering, sorting, and search |
| `GET` | `/products/:id` | Retrieve single product details by integer ID |

### Query Parameters for `GET /products`:
- `page`: Integer >= 1 (Default: `1`)
- `limit`: Integer 1..48 (Default: `12`)
- `category`: Comma-separated category slugs (e.g. `category=mens-clothing,electronics`)
- `minPrice` / `maxPrice`: Numeric price range filters (e.g. `minPrice=25&maxPrice=50`)
- `minRating`: Minimum rating threshold (e.g. `minRating=4`)
- `sort`: Sort key (`recommended` | `newest` | `popular` | `price_asc` | `price_desc`)
- `q`: Full-text search string matched using PostgreSQL trigram indexing

---

## 6. SSR Approach & SEO Decisions

1. **Pure Server Component Rendering**:
   - The initial request to `/products` executes on the server, producing unhydrated HTML containing the first 12 product cards, titles, prices, and images. Web crawlers (Googlebot, Bing) receive full content without executing client JavaScript.
2. **Dynamic Metadata & Social Graph**:
   - Page `<title>` and `<meta name="description">` dynamically reflect the active category filters and page number without lorem ipsum.
   - `<link rel="canonical">` points to the canonical sanitized URL with default query parameters stripped.
   - Open Graph (`og:title`, `og:image`, `og:url`) and Twitter Cards (`summary_large_image`) render with absolute image URLs.
3. **Structured Data (Schema.org JSON-LD)**:
   - Injects valid Schema.org `BreadcrumbList` and `ItemList` containing product objects with `Offer` pricing, currency, availability, and `AggregateRating`.
4. **Zero Cumulative Layout Shift (CLS 0.000)**:
   - Next.js `Image` components enforce fixed 3:4 aspect ratio wrappers with responsive `sizes` strings, preventing visual layout jumps during image loading.

---

## 7. Dependencies and Rationale

Every third-party package used is documented in [docs/DEPENDENCIES.md](file:///c:/Users/Aditya%20Nayak/Desktop/Projects/pdf%20gen/Appscrip-task-AdityaNayak/docs/DEPENDENCIES.md):
- `@nestjs/config`, `@nestjs/swagger`, `class-validator`, `class-transformer`: Backend configuration, validation, and documentation.
- `@prisma/client`, `prisma`: Type-safe database queries and migrations.
- `server-only`: Enforces server-only isolation for API fetchers.
- `vitest`: Ultra-fast unit testing runner.
- `@playwright/test`: Browser automation for responsive layout, SSR, and interaction testing.

---

## 8. AI Usage & Quality Guard

Development strictly adhered to engineering rigor with continuous verification and zero quality degradation:
- Every phase was validated with automated test runs, TypeScript checks, and browser rendering audits.
- Full details of prompts, edge-case corrections, and architectural decisions are tracked in [docs/AI_LOG.md](file:///c:/Users/Aditya%20Nayak/Desktop/Projects/pdf%20gen/Appscrip-task-AdityaNayak/docs/AI_LOG.md).

---

## 9. Known Limitations & Future Improvements

1. **Authentication & User Profiles**:
   - The wishlist and pricing note ("Sign in or Create an account to see pricing") use client-side reactive state (`localStorage`). Future work would integrate NextAuth / Auth0 for persistent multi-device wishlists.
2. **Edge Caching via Redis / Cloudflare KV**:
   - Products and categories are currently cached in-memory and at the HTTP header layer (`Cache-Control: public, s-maxage=60`). Adding Redis would provide sub-millisecond responses for high-concurrency traffic spikes.
3. **Cart & Checkout Flow**:
   - The shopping bag icon is currently decorative; a full Stripe or Shopify Headless checkout integration would complete the full e-commerce conversion funnel.
