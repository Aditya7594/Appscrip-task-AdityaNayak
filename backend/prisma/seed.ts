import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PrismaClient, Prisma } from '@prisma/client';
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

const DATA_FILE = path.resolve(__dirname, 'data/fakestore-products.json');
const IMAGES_DIR = path.resolve(__dirname, '../../frontend/public/products');

const prisma = new PrismaClient();

// Mulberry32 seeded pseudo-random number generator
function createMulberry32(seed: number): () => number {
  let s = seed;
  return function (): number {
    s += 0x6d2b79f5;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function toTitleCase(str: string): string {
  return str
    .split(' ')
    .map((word) => {
      if (word.toLowerCase().includes("'")) {
        // e.g. "men's" -> "Men's"
        const parts = word.split("'");
        return parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase() + "'" + parts[1].toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

function formatAltText(title: string, categoryName: string): string {
  const raw = `${title} - ${categoryName} product photo`;
  if (raw.length <= 125) {
    return raw;
  }
  return raw.slice(0, 122) + '...';
}

async function main(): Promise<void> {
  console.log('Starting database seed...');

  if (!fs.existsSync(DATA_FILE)) {
    throw new Error(
      `Snapshot data file not found at ${DATA_FILE}. Run "npm run images:download" first.`,
    );
  }

  const rawData = fs.readFileSync(DATA_FILE, 'utf-8');
  const rawProducts = JSON.parse(rawData) as FakeStoreProduct[];
  console.log(`Loaded ${rawProducts.length} raw products from snapshot.`);

  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
  }

  // 1. Extract and upsert unique categories
  const categoryMap = new Map<string, { id: number; name: string }>();
  const uniqueCategoryRawNames = Array.from(new Set(rawProducts.map((p) => p.category)));

  for (const rawName of uniqueCategoryRawNames) {
    const slug = slugify(rawName);
    const titleCaseName = toTitleCase(rawName);

    const category = await prisma.category.upsert({
      where: { slug },
      update: { name: titleCaseName },
      create: { slug, name: titleCaseName },
    });

    categoryMap.set(rawName, { id: category.id, name: category.name });
    console.log(`Category: "${category.name}" (slug: ${category.slug}) [ID: ${category.id}]`);
  }

  // PRNG with fixed seed for deterministic variants
  const rand = createMulberry32(123456789);
  const now = Date.now();

  let totalProducts = 0;
  let totalImages = 0;

  for (let i = 0; i < rawProducts.length; i++) {
    const raw = rawProducts[i];
    const categoryInfo = categoryMap.get(raw.category);
    if (!categoryInfo) {
      throw new Error(`Category not found for product: ${raw.title}`);
    }

    const baseSlug = slugify(raw.title);
    const baseDaysAgo = i * 2; // Staggered creation date
    const baseCreatedAt = new Date(now - baseDaysAgo * 86400000);

    const rawPrice = Number(raw.price) || 0;
    const rawRate = Number(raw.rating?.rate) || 0;
    const rawCount = Math.round(Number(raw.rating?.count)) || 0;

    // Items list for product: base + 2 variants
    const itemsToUpsert = [
      {
        slug: baseSlug,
        title: raw.title,
        description: raw.description,
        price: Number(rawPrice.toFixed(2)),
        rating: Math.min(5, Math.max(0, Math.round(rawRate * 10) / 10)),
        ratingCount: rawCount,
        createdAt: baseCreatedAt,
        isVariant: false,
      },
      {
        slug: `${baseSlug}-midnight`,
        title: `${raw.title} - Midnight`,
        description: `${raw.description} Limited edition Midnight colorway with signature styling.`,
        price: Math.max(1, Math.round(rawPrice * (0.85 + rand() * 0.3) * 100) / 100),
        rating: Math.min(5, Math.max(0, Math.round((rawRate + (rand() - 0.5) * 0.8) * 10) / 10)),
        ratingCount: Math.max(5, Math.round(rawCount * (0.6 + rand() * 0.8))),
        createdAt: new Date(now - (baseDaysAgo + Math.floor(rand() * 5) + 1) * 86400000),
        isVariant: true,
      },
      {
        slug: `${baseSlug}-sand`,
        title: `${raw.title} - Sand`,
        description: `${raw.description} Crafted in an understated Sand palette designed for everyday wear.`,
        price: Math.max(1, Math.round(rawPrice * (0.85 + rand() * 0.3) * 100) / 100),
        rating: Math.min(5, Math.max(0, Math.round((rawRate + (rand() - 0.5) * 0.8) * 10) / 10)),
        ratingCount: Math.max(5, Math.round(rawCount * (0.6 + rand() * 0.8))),
        createdAt: new Date(now - (baseDaysAgo + Math.floor(rand() * 5) + 2) * 86400000),
        isVariant: true,
      },
    ];

    for (const item of itemsToUpsert) {
      const product = await prisma.product.upsert({
        where: { slug: item.slug },
        update: {
          title: item.title,
          description: item.description,
          price: new Prisma.Decimal(item.price),
          rating: item.rating,
          ratingCount: item.ratingCount,
          categoryId: categoryInfo.id,
          createdAt: item.createdAt,
        },
        create: {
          slug: item.slug,
          title: item.title,
          description: item.description,
          price: new Prisma.Decimal(item.price),
          rating: item.rating,
          ratingCount: item.ratingCount,
          categoryId: categoryInfo.id,
          createdAt: item.createdAt,
        },
      });

      totalProducts++;

      // Copy image for variant if needed
      if (item.isVariant) {
        const baseImgPath = path.join(IMAGES_DIR, `${baseSlug}.jpg`);
        const variantImgPath = path.join(IMAGES_DIR, `${item.slug}.jpg`);
        if (fs.existsSync(baseImgPath) && !fs.existsSync(variantImgPath)) {
          fs.copyFileSync(baseImgPath, variantImgPath);
        }
      }

      // Upsert single ProductImage at position 0
      const altText = formatAltText(item.title, categoryInfo.name);
      await prisma.productImage.upsert({
        where: {
          productId_position: {
            productId: product.id,
            position: 0,
          },
        },
        update: {
          url: `/products/${item.slug}.jpg`,
          alt: altText,
        },
        create: {
          productId: product.id,
          url: `/products/${item.slug}.jpg`,
          alt: altText,
          position: 0,
        },
      });

      totalImages++;
    }
  }

  const categoryCount = await prisma.category.count();
  const productCount = await prisma.product.count();
  const imageCount = await prisma.productImage.count();

  console.log(`\nSeed completed successfully!`);
  console.log(`- Categories in DB: ${categoryCount}`);
  console.log(`- Products in DB:   ${productCount}`);
  console.log(`- Images in DB:     ${imageCount}`);
}

main()
  .catch((err) => {
    console.error('Seed execution failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
