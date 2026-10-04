import { test, expect } from '@playwright/test';

test.describe('Filters, Sort, and Pagination interactions', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('(a) choose a sort option -> URL has ?sort=...; first card changes', async ({ page }) => {
    await page.goto('/products');
    await page.waitForSelector('ul[class*="productGrid"]');

    const firstCardTitleInitial = await page
      .locator('h3[class*="productTitle"]')
      .first()
      .innerText();

    // Open desktop sort dropdown
    const sortTrigger = page.locator('button[aria-haspopup="listbox"]').first();
    await sortTrigger.click();

    // Select "Price : low to high"
    const lowToHighOption = page.locator('li[role="option"]', { hasText: 'Price : low to high' });
    await lowToHighOption.click();

    // Assert URL has ?sort=price_asc
    await expect(page).toHaveURL(/sort=price_asc/);

    // Assert first product title has changed
    await expect(async () => {
      const newTitle = await page.locator('h3[class*="productTitle"]').first().innerText();
      expect(newTitle).not.toBe(firstCardTitleInitial);
    }).toPass();
  });

  test('(b) tick a category -> URL has ?category=...; reload and state persists', async ({ page }) => {
    await page.goto('/products');
    const categoryCheckbox = page.locator('#filter-cat-mens-clothing');
    await expect(categoryCheckbox).toBeVisible();

    await categoryCheckbox.click();

    // URL has ?category=mens-clothing
    await expect(page).toHaveURL(/category=mens-clothing/);
    await expect(categoryCheckbox).toBeChecked();

    // Reload page and assert state persists
    await page.reload();
    await expect(page).toHaveURL(/category=mens-clothing/);
    await expect(page.locator('#filter-cat-mens-clothing')).toBeChecked();
  });

  test('(c) go to page 2 -> URL has ?page=2; changing a filter resets page', async ({ page }) => {
    await page.goto('/products');
    await page.waitForSelector('nav[aria-label="Pagination"]');

    // Click on page 2 link
    const page2Link = page.locator('nav[aria-label="Pagination"] a', { hasText: '2' });
    await page2Link.click();

    // Assert URL has ?page=2
    await expect(page).toHaveURL(/page=2/);

    // Tick a category filter (e.g. electronics)
    const electronicsCheckbox = page.locator('#filter-cat-electronics');
    await electronicsCheckbox.click();

    // Assert URL resets page back to page 1 (no page=2 in URL)
    await expect(page).not.toHaveURL(/page=2/);
    await expect(page).toHaveURL(/category=electronics/);
  });

  test('(d) browser back restores the previous state', async ({ page }) => {
    await page.goto('/products');
    await page.waitForSelector('nav[aria-label="Pagination"]');

    // Go to page 2
    const page2Link = page.locator('nav[aria-label="Pagination"] a', { hasText: '2' });
    await page2Link.click();
    await expect(page).toHaveURL(/page=2/);

    // Apply category filter
    const jeweleryCheckbox = page.locator('#filter-cat-jewelery');
    await jeweleryCheckbox.click();
    await expect(page).toHaveURL(/category=jewelery/);

    // Go back in history
    await page.goBack();

    // Assert URL has page=2 again and jewelery filter is gone
    await expect(page).toHaveURL(/page=2/);
    await expect(page).not.toHaveURL(/category=jewelery/);
  });

  test('(e) empty state appears for a nonsense q', async ({ page }) => {
    await page.goto('/products?q=xyznonexistentquery999');

    // Assert empty state heading is displayed
    const emptyHeading = page.getByRole('heading', { name: 'No products match your filters' });
    await expect(emptyHeading).toBeVisible();

    // Assert Clear all filters link is visible
    const clearLink = page.getByRole('link', { name: 'Clear all filters' });
    await expect(clearLink).toBeVisible();
    await expect(clearLink).toHaveAttribute('href', '/products');
  });

  test('(f) hide/show filter toggles 3 <-> 4 columns via computed style', async ({ page }) => {
    await page.goto('/products');
    const grid = page.locator('ul[class*="productGrid"]');
    await expect(grid).toBeVisible();

    const getColumnCount = async () => {
      return await grid.evaluate((el) => {
        const template = window.getComputedStyle(el).gridTemplateColumns;
        return template.trim().split(/\s+/).length;
      });
    };

    // Default desktop: filters open -> 3 columns
    expect(await getColumnCount()).toBe(3);
    const layout = page.locator('[data-filters]');
    await expect(layout).toHaveAttribute('data-filters', 'open');

    // Click "Hide filter"
    const hideBtn = page.getByRole('button', { name: /Hide filter/i });
    await hideBtn.click();

    // Filters hidden -> 4 columns
    await expect(layout).toHaveAttribute('data-filters', 'hidden');
    expect(await getColumnCount()).toBe(4);

    // Click "Show filter"
    const showBtn = page.getByRole('button', { name: /Show filter/i });
    await showBtn.click();

    // Filters open -> 3 columns restored
    await expect(layout).toHaveAttribute('data-filters', 'open');
    expect(await getColumnCount()).toBe(3);
  });
});
