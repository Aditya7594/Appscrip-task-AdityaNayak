import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '../prisma/data');
const DATA_FILE = path.join(DATA_DIR, 'fakestore-products.json');
const IMAGES_DIR = path.resolve(__dirname, '../../frontend/public/products');

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

interface DummyProduct {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
  thumbnail: string;
  images: string[];
}

interface NormalizedProduct {
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

async function fetchCategory(category: string): Promise<DummyProduct[]> {
  const url = `https://dummyjson.com/products/category/${category}`;
  console.log(`Fetching ${url}...`);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: HTTP ${res.status}`);
  }
  const data = (await res.json()) as { products: DummyProduct[] };
  return data.products;
}

async function downloadImage(url: string, destPath: string): Promise<void> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to download ${url}: HTTP ${res.status}`);
  }
  const arrayBuffer = await res.arrayBuffer();
  fs.writeFileSync(destPath, Buffer.from(arrayBuffer));
}

async function main() {
  console.log('--- Fetching Clean Fashion & Luxury Catalog from DummyJSON ---');

  const shirts = await fetchCategory('mens-shirts');
  const shoes = await fetchCategory('mens-shoes');
  const sun = await fetchCategory('sunglasses');

  const dresses = await fetchCategory('womens-dresses');
  const bags = await fetchCategory('womens-bags');
  const tops = await fetchCategory('tops');

  const jewel = await fetchCategory('womens-jewellery');
  const mWatches = await fetchCategory('mens-watches');
  const wWatches = await fetchCategory('womens-watches');
  const frag = await fetchCategory('fragrances');

  const mobile = await fetchCategory('mobile-accessories');
  const phones = await fetchCategory('smartphones');
  const laptops = await fetchCategory('laptops');

  // Exactly 15 per category = 60 products total
  const rawPool: Array<{ item: DummyProduct; category: string }> = [
    // Men's Clothing (15)
    ...shirts.map((p) => ({ item: p, category: "men's clothing" })),
    ...shoes.map((p) => ({ item: p, category: "men's clothing" })),
    ...sun.map((p) => ({ item: p, category: "men's clothing" })),

    // Women's Clothing (15)
    ...dresses.map((p) => ({ item: p, category: "women's clothing" })),
    ...bags.map((p) => ({ item: p, category: "women's clothing" })),
    ...tops.map((p) => ({ item: p, category: "women's clothing" })),

    // Jewelery (15)
    ...jewel.map((p) => ({ item: p, category: 'jewelery' })),
    ...mWatches.map((p) => ({ item: p, category: 'jewelery' })),
    ...wWatches.map((p) => ({ item: p, category: 'jewelery' })),
    ...frag.map((p) => ({ item: p, category: 'jewelery' })),

    // Electronics (15)
    ...mobile.map((p) => ({ item: p, category: 'electronics' })),
    ...phones.map((p) => ({ item: p, category: 'electronics' })),
    ...laptops.map((p) => ({ item: p, category: 'electronics' })),
  ];

  // Group by category and take top 15 each
  const grouped: Record<string, DummyProduct[]> = {
    "men's clothing": [],
    "women's clothing": [],
    jewelery: [],
    electronics: [],
  };

  for (const { item, category } of rawPool) {
    if (grouped[category].length < 15) {
      grouped[category].push(item);
    }
  }

  const selectedProducts: NormalizedProduct[] = [];
  let currentId = 1;

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
  }

  // Clear previous images to ensure clean directory
  const existingFiles = fs.readdirSync(IMAGES_DIR);
  for (const file of existingFiles) {
    fs.unlinkSync(path.join(IMAGES_DIR, file));
  }
  console.log(`Cleaned ${existingFiles.length} old images from ${IMAGES_DIR}`);

  const usedSlugs = new Set<string>();

  for (const [catName, items] of Object.entries(grouped)) {
    console.log(`\nProcessing ${catName} (${items.length} products)...`);
    for (const item of items) {
      let slug = slugify(item.title);
      if (usedSlugs.has(slug)) {
        slug = `${slug}-${currentId}`;
      }
      usedSlugs.add(slug);

      // Best high-res image
      const imageUrl = item.images?.[0] || item.thumbnail;

      const norm: NormalizedProduct = {
        id: currentId++,
        title: item.title,
        price: Number(item.price.toFixed(2)),
        description: item.description,
        category: catName,
        image: imageUrl,
        rating: {
          rate: Math.min(5, Math.max(3.8, Math.round(item.rating * 10) / 10)),
          count: Math.round((item.stock || 20) * 8 + 35),
        },
      };

      selectedProducts.push(norm);

      // Download image as both .jpg and .webp for complete format compatibility
      const jpgPath = path.join(IMAGES_DIR, `${slug}.jpg`);
      const webpPath = path.join(IMAGES_DIR, `${slug}.webp`);

      try {
        await downloadImage(imageUrl, jpgPath);
        fs.copyFileSync(jpgPath, webpPath);
        process.stdout.write(`✔ [${norm.id}/60] Downloaded: ${slug}\n`);
      } catch (err: any) {
        console.error(`✖ Failed to download ${imageUrl} for ${slug}:`, err.message);
      }
    }
  }

  // Save clean snapshot to fakestore-products.json
  fs.writeFileSync(DATA_FILE, JSON.stringify(selectedProducts, null, 2), 'utf-8');
  console.log(`\nSuccessfully saved ${selectedProducts.length} clean products to ${DATA_FILE}`);
  console.log(`Images saved to ${IMAGES_DIR}`);
}

main().catch(console.error);
