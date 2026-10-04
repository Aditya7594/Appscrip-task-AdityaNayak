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

  const now = Date.now();

  // Clean wipe existing products & images to replace with new clean catalog
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  console.log('Cleaned previous products and images from database.');

  let totalProducts = 0;
  let totalImages = 0;
  const usedSlugs = new Set<string>();

  for (let i = 0; i < rawProducts.length; i++) {
    const raw = rawProducts[i];
    const categoryInfo = categoryMap.get(raw.category);
    if (!categoryInfo) {
      throw new Error(`Category not found for product: ${raw.title}`);
    }

    let slug = slugify(raw.title);
    if (usedSlugs.has(slug)) {
      slug = `${slug}-${raw.id}`;
    }
    usedSlugs.add(slug);

    const baseDaysAgo = i; // Staggered creation date
    const baseCreatedAt = new Date(now - baseDaysAgo * 86400000);

    const rawPrice = Number(raw.price) || 0;
    const rawRate = Number(raw.rating?.rate) || 0;
    const rawCount = Math.round(Number(raw.rating?.count)) || 0;

    const product = await prisma.product.upsert({
      where: { slug },
      update: {
        title: raw.title,
        description: raw.description,
        price: new Prisma.Decimal(rawPrice),
        rating: Math.min(5, Math.max(0, Math.round(rawRate * 10) / 10)),
        ratingCount: rawCount,
        categoryId: categoryInfo.id,
        createdAt: baseCreatedAt,
      },
      create: {
        slug,
        title: raw.title,
        description: raw.description,
        price: new Prisma.Decimal(rawPrice),
        rating: Math.min(5, Math.max(0, Math.round(rawRate * 10) / 10)),
        ratingCount: rawCount,
        categoryId: categoryInfo.id,
        createdAt: baseCreatedAt,
      },
    });

    totalProducts++;

    const altText = formatAltText(raw.title, categoryInfo.name);
    await prisma.productImage.upsert({
      where: {
        productId_position: {
          productId: product.id,
          position: 0,
        },
      },
      update: {
        url: `/products/${slug}.jpg`,
        alt: altText,
      },
      create: {
        productId: product.id,
        url: `/products/${slug}.jpg`,
        alt: altText,
        position: 0,
      },
    });

    totalImages++;
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
