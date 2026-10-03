import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { slugify } from '../src/common/utils/slugify.js';

interface FakeStoreProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '../prisma/data');
const DATA_FILE = path.join(DATA_DIR, 'fakestore-products.json');
const IMAGES_DIR = path.resolve(__dirname, '../../frontend/public/products');

const FAKESTORE_API_URL = 'https://fakestoreapi.com/products';
const FAKESTORE_MIRROR_URL =
  'https://raw.githubusercontent.com/ProgrammingHero1/ranga-store-api/main/ranga-api.json';

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchProducts(): Promise<FakeStoreProduct[]> {
  console.log(`Fetching products from ${FAKESTORE_API_URL}...`);
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(FAKESTORE_API_URL, { signal: controller.signal });
    clearTimeout(timeout);

    if (res.ok) {
      return (await res.json()) as FakeStoreProduct[];
    }
    console.warn(`[WARN] FakeStore API returned HTTP ${res.status}. Falling back to GitHub mirror...`);
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.warn(`[WARN] FakeStore API unreachable (${errMsg}). Falling back to GitHub mirror...`);
  }

  console.log(`Fetching products from mirror: ${FAKESTORE_MIRROR_URL}...`);
  const mirrorRes = await fetch(FAKESTORE_MIRROR_URL);
  if (!mirrorRes.ok) {
    throw new Error(`Mirror request failed with status: ${mirrorRes.status}`);
  }
  return (await mirrorRes.json()) as FakeStoreProduct[];
}

async function downloadWithRetry(primaryUrl: string, destPath: string, maxRetries = 3): Promise<void> {
  const imageName = primaryUrl.split('/').pop() ?? '';
  const cdnFallbackUrl = imageName
    ? `https://m.media-amazon.com/images/I/${imageName}`
    : primaryUrl;

  const candidateUrls = [primaryUrl, cdnFallbackUrl];

  for (const url of candidateUrls) {
    let attempt = 0;
    while (attempt < maxRetries) {
      attempt++;
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeout);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status} ${response.statusText}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        fs.writeFileSync(destPath, Buffer.from(arrayBuffer));
        return;
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err);
        if (attempt >= maxRetries) {
          console.warn(`[RETRY EXHAUSTED] URL ${url} failed: ${errMsg}`);
          break;
        }
        await sleep(500);
      }
    }
  }

  throw new Error(`Failed to download image for ${destPath} after exhausting all sources.`);
}

async function main(): Promise<void> {
  const products = await fetchProducts();
  console.log(`Retrieved ${products.length} products.`);

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
  }

  // Save snapshot to prisma/data/fakestore-products.json
  fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2), 'utf-8');
  console.log(`Saved snapshot to ${DATA_FILE}`);

  let downloadedCount = 0;
  let skippedCount = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const slug = slugify(product.title);
    const destPath = path.join(IMAGES_DIR, `${slug}.jpg`);

    if (fs.existsSync(destPath)) {
      console.log(`[${i + 1}/${products.length}] [SKIP] ${slug}.jpg already exists.`);
      skippedCount++;
      continue;
    }

    console.log(`[${i + 1}/${products.length}] [DOWNLOADING] ${product.title} -> ${slug}.jpg`);
    await downloadWithRetry(product.image, destPath, 3);
    downloadedCount++;
  }

  console.log(
    `\nImage download complete! Total: ${products.length} | Downloaded: ${downloadedCount} | Skipped: ${skippedCount}`,
  );
}

main().catch((err) => {
  console.error('Download images failed:', err);
  process.exit(1);
});
