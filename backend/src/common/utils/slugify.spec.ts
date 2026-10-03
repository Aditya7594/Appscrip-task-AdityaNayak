import { slugify } from './slugify.js';

describe('slugify', () => {
  it('converts titles to lowercase hyphenated ascii slugs', () => {
    expect(slugify("Men's Cotton Jacket")).toBe('mens-cotton-jacket');
    expect(slugify('Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops')).toBe(
      'fjallraven-foldsack-no-1-backpack-fits-15-laptops',
    );
  });

  it('caps slugs to max 60 characters without trailing hyphen', () => {
    const longTitle = 'John Hardy Women\'s Legends Naga Gold & Silver Dragon Station Chain Bracelet';
    const slug = slugify(longTitle);
    expect(slug.length).toBeLessThanOrEqual(60);
    expect(slug.endsWith('-')).toBe(false);
  });

  it('handles empty input gracefully', () => {
    expect(slugify('')).toBe('');
  });
});
