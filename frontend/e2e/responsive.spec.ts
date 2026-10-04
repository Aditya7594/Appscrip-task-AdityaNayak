import { test, expect } from '@playwright/test';

const BREAKPOINTS = [320, 375, 414, 768, 1024, 1200, 1440, 1920];

test.describe('Responsive layouts and horizontal overflow verification', () => {
  for (const width of BREAKPOINTS) {
    test(`width ${width}px has no horizontal overflow (document.documentElement.scrollWidth <= innerWidth)`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/products');
      await page.waitForSelector('ul[class*="productGrid"]');

      const isNoOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth <= window.innerWidth;
      });

      expect(isNoOverflow).toBe(true);
    });
  }

  test('at 375px viewport, sidebar is not inline and 2-column grid is used', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/products');
    await page.waitForSelector('ul[class*="productGrid"]');

    // 1. Assert desktop sidebar is not inline (display: none)
    const isSidebarInline = await page.evaluate(() => {
      const sidebar = document.getElementById('filters');
      if (!sidebar) return false;
      const style = window.getComputedStyle(sidebar);
      return style.display !== 'none';
    });
    expect(isSidebarInline).toBe(false);

    // 2. Assert 2-column grid is used
    const grid = page.locator('ul[class*="productGrid"]');
    const colCount = await grid.evaluate((el) => {
      const template = window.getComputedStyle(el).gridTemplateColumns;
      return template.trim().split(/\s+/).length;
    });
    expect(colCount).toBe(2);
  });
});
