# AGENTS.md

## Goal
Build the Appscrip PLP end to end (frontend Next.js SSR, backend NestJS REST API, PostgreSQL via Prisma, deployed publicly).

## Stack
Next.js App Router + TypeScript, plain CSS (CSS Modules + global tokens), NestJS + Express, Prisma + PostgreSQL, npm.

## Folder conventions
- `backend/src/<feature>/{module,controller,service,dto}`
- `frontend/src/{app,components,lib,types}`
- `static/` holds the plain HTML/CSS version.

## Naming
- kebab-case files
- PascalCase React components
- camelCase variables and functions
- SCREAMING_SNAKE_CASE env vars
- BEM-style class names in static CSS

## Rules
- TypeScript strict and no `any`
- No new dependency without adding a one-line justification row to docs/DEPENDENCIES.md
- No UI kits, no CSS frameworks, no state libraries
- No secrets in git (only .env.example)
- Conventional commits (feat, fix, chore, docs, test, refactor), one logical change per commit
- Keep the DOM minimal (no wrapper elements that do nothing)
- Semantic HTML
- Never invent design values - read docs/DESIGN_SPEC.md
- Before finishing any task run lint + build + tests and report results
- Never assume code exists that you have not seen in the repo - read the files first

## Definition of done for every task
Compiles, lints, tested where relevant, committed with a good message, and you list the files you created or changed.

## API CONTRACT
API CONTRACT (single source of truth)
Base URL: http://localhost:4000 (dev). No global prefix.
GET /health -> { status: "ok", uptime: number, timestamp: string }
GET /categories -> [{ id, slug, name, productCount }] ordered by name.
GET /products?page&limit&category&minPrice&maxPrice&minRating&sort&q
page int >=1 (default 1) | limit int 1..48 (default 12) | category comma-separated slugs (max 10) |
minPrice, maxPrice numbers >=0 and minPrice <= maxPrice | minRating 0..5 | sort
recommended|newest|popular|price_asc|price_desc (default recommended) | q string 1..80-> { data: Product[], meta: { page, limit, total, totalPages, hasNextPage, hasPreviousPage } }
GET /products/:id -> Product (400 if id is not an integer, 404 if missing)
Product = { id, slug, title, description, price (number), currency "USD", rating, ratingCount, category: {
id, slug, name }, images: [{ url, alt, position }], createdAt }
Error shape for every failure = { statusCode, error, message (string or string[]), path, timestamp }
