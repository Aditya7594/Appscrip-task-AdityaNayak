import { test, expect } from '@playwright/test';

test.describe('SSR & SEO Raw HTML verification (no browser JS)', () => {
  test('GET /products raw HTML contains 12 titles, title, canonical, og:title, and JSON-LD ItemList', async ({
    request,
  }) => {
    // Fetch raw HTML directly via request API without executing any client JS
    const response = await request.get('/products');
    expect(response.ok()).toBe(true);
    const html = await response.text();

    // 1. Verify <title> tag
    expect(html).toMatch(/<title[^>]*>[\s\S]*?<\/title>/);
    expect(html).toContain('mettā muse');

    // 2. Verify canonical <link>
    expect(html).toMatch(/<link[^>]*rel=["']canonical["'][^>]*href=["'][^"']+["']/);

    // 3. Verify og:title meta tag
    expect(html).toMatch(/<meta[^>]*property=["']og:title["'][^>]*content=["'][^"']+["']/);

    // 4. Verify application/ld+json with ItemList
    const jsonLdMatch = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/);
    expect(jsonLdMatch).not.toBeNull();
    const rawParsed = JSON.parse(jsonLdMatch![1]);
    const itemList = Array.isArray(rawParsed)
      ? rawParsed.find((item: { ['@type']?: string }) => item['@type'] === 'ItemList')
      : rawParsed;

    expect(itemList).toBeDefined();
    expect(itemList['@type']).toBe('ItemList');
    expect(Array.isArray(itemList.itemListElement)).toBe(true);
    expect(itemList.itemListElement.length).toBe(12);

    // 5. Verify raw HTML contains 12 product titles from backend API
    const apiRes = await request.get('http://localhost:4000/products?page=1&limit=12');
    expect(apiRes.ok()).toBe(true);
    const apiData = await apiRes.json();
    expect(apiData.data).toHaveLength(12);

    for (const product of apiData.data) {
      expect(html).toContain(product.title);
    }
  });

  test('GET /products?category=mens-clothing returns only that category items compared against API', async ({
    request,
  }) => {
    // 1. Fetch category items and non-category items from backend API
    const categoryApiRes = await request.get('http://localhost:4000/products?category=mens-clothing&limit=12');
    expect(categoryApiRes.ok()).toBe(true);
    const categoryApiData = await categoryApiRes.json();
    const mensClothingProducts = categoryApiData.data;
    expect(mensClothingProducts.length).toBeGreaterThan(0);

    // Fetch items from a distinct category (e.g. electronics) to assert they are not present
    const otherApiRes = await request.get('http://localhost:4000/products?category=electronics&limit=12');
    expect(otherApiRes.ok()).toBe(true);
    const otherApiData = await otherApiRes.json();
    const electronicsProducts = otherApiData.data;
    expect(electronicsProducts.length).toBeGreaterThan(0);

    // 2. Fetch raw HTML for ?category=mens-clothing
    const pageRes = await request.get('/products?category=mens-clothing');
    expect(pageRes.ok()).toBe(true);
    const html = await pageRes.text();

    // 3. Assert all mens-clothing products are present in the HTML
    for (const product of mensClothingProducts) {
      expect(html).toContain(product.title);
    }

    // 4. Assert non-mens-clothing products (electronics) are NOT present in the HTML
    for (const product of electronicsProducts) {
      expect(html).not.toContain(product.title);
    }
  });

  test('GET /products?page=999 redirects', async ({ request }) => {
    // Test with maxRedirects: 0 to catch HTTP 307/308 redirect,
    // or verify meta-refresh redirect tag injected by Next.js streaming SSR
    const response = await request.get('/products?page=999', { maxRedirects: 0 });
    const status = response.status();
    const headers = response.headers();
    const text = await response.text();

    const isHttpRedirect = (status === 307 || status === 308 || status === 302 || status === 301) &&
      Boolean(headers['location']?.includes('page='));
    const isMetaRedirect = text.includes('http-equiv="refresh"') && text.includes('page=5');
    const isNextRedirectId = text.includes('__next-page-redirect');

    expect(isHttpRedirect || isMetaRedirect || isNextRedirectId).toBe(true);

    // Also verify following redirect reaches a valid page (page 5)
    const followedRes = await request.get('/products?page=999');
    expect(followedRes.ok()).toBe(true);
  });
});
