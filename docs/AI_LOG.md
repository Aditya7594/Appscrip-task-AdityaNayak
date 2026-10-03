# AI usage log

> Note: Log at least one real correction per phase.

| Date | Tool | Task | What the AI got wrong or I rejected | How I corrected it |
| :--- | :--- | :--- | :--- | :--- |
| 2026-10-03 | Antigravity IDE / Gemini | Scaffolding | Initial setup phase | Initialized project structure and documentation strictly according to specification without installing premature packages |
| 2026-10-03 | Antigravity IDE / Gemini | Backend Bootstrap | Exception filter used `String(exception)` causing oxlint `no-base-to-string` warning, and ESM `start:prod` script lacked `.js` extension | Explicitly checked exception types and JSON-stringified payloads; corrected `start:prod` to `node dist/main.js` |
| 2026-10-03 | Antigravity IDE / Gemini | PostgreSQL & Prisma | npm pulled experimental Prisma 8.0.0-rc preview platform CLI which broke standard ORM commands (`migrate dev`, `studio`, etc.) | Downgraded and pinned to latest stable official Prisma ORM release `6.19.3` (`prisma` & `@prisma/client`); also isolated `PrismaService` in e2e tests |
