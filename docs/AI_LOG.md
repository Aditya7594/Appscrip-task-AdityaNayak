# AI usage log

> Note: Log at least one real correction per phase.

| Date | Tool | Task | What the AI got wrong or I rejected | How I corrected it |
| :--- | :--- | :--- | :--- | :--- |
| 2026-10-03 | Antigravity IDE / Gemini | Scaffolding | Initial setup phase | Initialized project structure and documentation strictly according to specification without installing premature packages |
| 2026-10-03 | Antigravity IDE / Gemini | Backend Bootstrap | Exception filter used `String(exception)` causing oxlint `no-base-to-string` warning, and ESM `start:prod` script lacked `.js` extension | Explicitly checked exception types and JSON-stringified payloads; corrected `start:prod` to `node dist/main.js` |
| 2026-10-03 | Antigravity IDE / Gemini | PostgreSQL & Prisma | npm pulled experimental Prisma 8.0.0-rc preview platform CLI which broke standard ORM commands (`migrate dev`, `studio`, etc.) | Downgraded and pinned to latest stable official Prisma ORM release `6.19.3` (`prisma` & `@prisma/client`); also isolated `PrismaService` in e2e tests |
| 2026-10-03 | Antigravity IDE / Gemini | Data Ingestion & Seed | fakestoreapi.com returned Cloudflare 522 Gateway Timeout | Added graceful fallback to GitHub dataset mirror and Amazon image CDN with AbortController timeouts and retry handling |
| 2026-10-03 | Antigravity IDE / Gemini | Categories Endpoint | Prisma `findMany` returns nested `_count.products` aggregation | Mapped database model to clean `CategoryDto` preventing internal DB structure leakage; configured `Cache-Control: public, max-age=60` header |
| 2026-10-03 | Antigravity IDE / Gemini | Products Endpoint | Prisma Decimal price and query pagination edge case when `page > totalPages` | Converted Decimal to number via `price.toNumber()`, pinned currency to 'USD', enforced id tie-breaker for deterministic sorting, and returned 200 with empty data array when page exceeds totalPages |
| 2026-10-03 | Antigravity IDE / Gemini | Product Details & Error Handling | Potential leakage of internal server error messages or raw database errors on 500 status codes | Ensured HttpExceptionFilter sanitizes any status >= 500 to a generic "Internal server error" while logging full details to server logger; created ErrorResponseDto and verified ParseIntPipe 400 and NotFound 404 responses |
