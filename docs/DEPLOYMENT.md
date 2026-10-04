# Production Deployment Guide

This guide provides an end-to-end, ordered deployment checklist for running the **mettā muse** Product Listing Page application in production across **Neon** (PostgreSQL), **Render** (NestJS REST API), and **Vercel** (Next.js SSR Frontend).

---

## Architecture Overview

```
                      ┌──────────────────────┐
                      │   Vercel Edge/CDN    │
                      │  (Next.js 16 SSR)    │
                      └──────────┬───────────┘
                                 │
                     SSR Fetch   │  Client AJAX
               (server-to-server)│  (CORS enabled)
                                 ▼
                      ┌──────────────────────┐
                      │    Render Web Svc    │
                      │   (NestJS API App)   │
                      └──────────┬───────────┘
                                 │
                   PgBouncer     │  Direct Connection
                 Connection Pool │  (Migrations & DDL)
                                 ▼
                      ┌──────────────────────┐
                      │   Neon PostgreSQL    │
                      │   (v16 + pg_trgm)    │
                      └──────────────────────┘
```

---

## Prerequisites

1. A **GitHub** account containing the pushed project repository.
2. A free **Neon** account ([neon.tech](https://neon.tech)).
3. A free **Render** account ([render.com](https://render.com)).
4. A free **Vercel** account ([vercel.com](https://vercel.com)).
5. Local Node.js v20+ and npm installed.

---

## Step 1: Create Neon Database & Retrieve Connection Strings

1. Log into your **Neon Console** at [console.neon.tech](https://console.neon.tech).
2. Click **Create Project**:
   - **Name**: `appscrip-plp` (or preferred name).
   - **Postgres version**: `16` (or latest).
   - **Region**: Choose the region closest to your Render service (e.g., `US East (Ohio)` or `US East (N. Virginia)`).
3. Once provisioned, locate the **Connection Details** card on the project dashboard:
   - Check the **Connection pooling** toggle:
     - **Pooled connection string** (contains `-pooler` in host, e.g. `ep-xyz-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require`).
     - **Direct connection string** (uncheck *Connection pooling*, e.g. `ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require`).
4. Keep both strings accessible in a secure scratchpad (do NOT commit them).

> [!NOTE]
> **PostgreSQL Extension Support**:
> Migration `20261003154330_add_title_trigram_search` executes `CREATE EXTENSION IF NOT EXISTS pg_trgm;` and builds a GIN trigram index on product titles. Neon supports `pg_trgm` out of the box with standard database owner privileges.

---

## Step 2: Apply Migrations & Seed Data from Local Terminal

Run the Prisma migrations and database seed script against your new Neon database from your local machine.

### Safe One-Command Execution (Preventing Secret Leakage)

To avoid storing the production database credentials in shell history or project `.env` files:

#### On Linux / macOS (bash/zsh):
```bash
# Leading space prevents command from being saved in bash/zsh history (when HISTCONTROL=ignorespace)
 DATABASE_URL="postgresql://user:password@ep-xyz.region.neon.tech/neondb?sslmode=require" npx --prefix backend prisma migrate deploy

 DATABASE_URL="postgresql://user:password@ep-xyz.region.neon.tech/neondb?sslmode=require" npx --prefix backend prisma db seed
```

#### On Windows (PowerShell):
```powershell
# Set temporary session-only environment variable, execute, and immediately clear:
$env:DATABASE_URL="postgresql://user:password@ep-xyz.region.neon.tech/neondb?sslmode=require"
npm --prefix backend run prisma:deploy
npm --prefix backend run seed
Remove-Item Env:\DATABASE_URL
```

Expected output:
- `Prisma Migrate applied 2 migrations`
- `Database has been seeded with 4 categories and 60 products`

---

## Step 3: Deploy Backend on Render using Blueprint (`render.yaml`)

The repository root includes a [`render.yaml`](file:///c:/Users/Aditya%20Nayak/Desktop/Projects/pdf%20gen/Appscrip-task-AdityaNayak/render.yaml) specification configured with:
- **Root Directory**: `backend`
- **Build Command**: `npm ci && npx prisma generate && npm run build`
- **Pre-deploy Command**: `npx prisma migrate deploy`
- **Start Command**: `npm run start:prod`
- **Health Check Path**: `/health`

### Dashboard Steps:
1. Log into **Render** ([dashboard.render.com](https://dashboard.render.com)).
2. Click **New +** > **Blueprint**.
3. Select and connect your GitHub repository.
4. Render will parse `render.yaml` and discover the `plp-api` web service.
5. In the service setup screen, fill in the prompted environment variables (marked with `sync: false`):
   - `DATABASE_URL`: Paste the **Pooled** Neon connection string (e.g. `postgresql://user:password@ep-xyz-pooler.region.neon.tech/neondb?sslmode=require`).
   - `CORS_ORIGINS`: Provide temporary placeholder `http://localhost:3000,https://*.vercel.app` (we will update this with the exact Vercel production URL in Step 5).
   - `NODE_ENV`: Pre-filled to `production`.
6. Click **Apply**.
7. Wait for the initial build and deployment to finish. Once live, copy your Render service URL (e.g., `https://plp-api-xxxx.onrender.com`).

---

## Step 4: Deploy Frontend on Vercel

1. Log into **Vercel** ([vercel.com/dashboard](https://vercel.com/dashboard)).
2. Click **Add New...** > **Project**.
3. Import your GitHub repository.
4. Configure the project settings:
   - **Framework Preset**: `Next.js` (automatically detected).
   - **Root Directory**: Click *Edit* and select `frontend`.
5. Expand **Environment Variables** and add:
   | Key | Value | Description |
   | :--- | :--- | :--- |
   | `API_BASE_URL` | `https://plp-api-xxxx.onrender.com` | Your live Render backend URL (no trailing slash) |
   | `NEXT_PUBLIC_SITE_URL` | `https://appscrip-plp.vercel.app` | Anticipated Vercel production domain |
6. Click **Deploy**.
7. Wait ~60 seconds for the production build to compile and deploy. Copy the deployed Vercel URL (e.g., `https://appscrip-plp-xxxx.vercel.app` or production alias).

---

## Step 5: Finalize CORS & Production URLs

1. Return to the **Render Dashboard**:
   - Go to `plp-api` > **Environment**.
   - Edit `CORS_ORIGINS` to include your final Vercel production URL and preview wildcards:
     ```text
     https://appscrip-plp-xxxx.vercel.app, https://*.vercel.app
     ```
   - Click **Save Changes** (Render automatically triggers a zero-downtime redeploy).
2. If your final Vercel production domain changed, update `NEXT_PUBLIC_SITE_URL` in **Vercel** > **Project Settings** > **Environment Variables**, then trigger **Redeploy** on the latest deployment.

---

## Step 6: Production Verification Commands

Run these terminal checks to verify each layer of the live deployment:

### 1. Backend Health Check
```bash
curl -i https://<your-render-url>/health
```
*Expected response*: HTTP 200 with JSON payload:
```json
{"status":"ok","uptime":...,"timestamp":"..."}
```

### 2. Backend Products Query
```bash
curl -i "https://<your-render-url>/products?limit=2"
```
*Expected response*: HTTP 200 with `{ "data": [ ... ], "meta": { "total": 60, "limit": 2, ... } }`.

### 3. Backend OpenAPI Swagger UI
```bash
curl -i https://<your-render-url>/docs
```
*Expected response*: HTTP 200 HTML page containing Swagger UI.

### 4. Frontend SSR Raw HTML Product Count Check
```bash
curl -s https://<your-vercel-url>/products | grep -c '<h3'
```
*Expected output*: Exactly `12` (verifying 12 product card titles rendered on the server without client JS).

### 5. View-Source / Head Elements Check
Open `https://<your-vercel-url>/products` in Chrome, press `Ctrl+U` (or right click > *View Page Source*), and verify:
- `<title>Shop All Products | mettā muse</title>` is present in raw HTML.
- `<link rel="canonical" href="https://.../products"/>` is present.
- `<meta property="og:title" .../>` is present.
- `<script type="application/ld+json">` contains valid `ItemList` structured data with 12 items.

### 6. Lighthouse Audit
Run Chrome DevTools Lighthouse (Desktop & Mobile) on the live URL:
- Performance >= 95
- Accessibility = 100
- Best Practices = 100
- SEO = 100

---

## Step 7: Troubleshooting Matrix

| Issue | Root Cause | Solution |
| :--- | :--- | :--- |
| **CORS Error** in browser console (`Access to fetch... blocked by CORS policy`) | `CORS_ORIGINS` on Render does not include the exact Vercel domain or includes trailing slashes. | Open Render > `plp-api` > Environment. Set `CORS_ORIGINS` to `https://<your-app>.vercel.app,https://*.vercel.app` (no trailing slashes, comma-separated). Save changes to redeploy. |
| **500 Internal Server Error** on Frontend SSR | Frontend cannot reach backend, or backend threw 500 connecting to Neon. | 1. Check Render logs to ensure `DATABASE_URL` is valid.<br>2. Check `API_BASE_URL` in Vercel environment variables.<br>3. Verify backend `/health` endpoint responds with 200. |
| **Images Return 404** | Product images missing from public directory. | All 60 optimized product images are committed under `frontend/public/products/*.jpg`. Ensure Vercel root directory is set to `frontend` so `public/` is copied into the Next.js bundle. |
| **Render Cold Start Latency (30–50s)** | Free-tier Render web services spin down after 15 minutes of inactivity. | 1. `frontend/src/lib/api/client.ts` is configured with a 35s timeout and automatic 1x retry with backoff.<br>2. Set up a free keep-warm ping (see below) to eliminate cold starts. |
| **Database Migration Lock / PgBouncer Timeout** | Running DDL migrations against a pooled connection that does not support session advisory locks. | Use the **Direct** Neon connection string (non-pooled) when running `prisma migrate deploy`. |

---

## Step 8: Keep-Warm Configuration (Optional but Recommended)

Render's free tier spins down web services after 15 minutes of inactivity, causing the first subsequent request to experience a 30–50 second cold start delay while the instance spins up.

To keep the free-tier backend warm 24/7 at zero cost:
1. Sign up for a free monitor on [cron-job.org](https://cron-job.org) or [uptimerobot.com](https://uptimerobot.com).
2. Create an HTTP monitor:
   - **URL**: `https://<your-render-url>/health`
   - **Interval**: Every `10 minutes` (well within Render's 15-minute sleep threshold).
   - **Method**: `GET`
3. This ensures incoming traffic keeps the NestJS container in memory, delivering instant (< 100ms) responses to Next.js SSR requests.
