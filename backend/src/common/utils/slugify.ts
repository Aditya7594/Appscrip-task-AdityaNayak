/**
 * Generates an SEO-friendly URL slug from a string.
 * - Lowercase
 * - ASCII characters only (removes accents/special characters)
 * - Words separated by hyphens
 * - Trimmed to a maximum length of 60 characters
 */
export function slugify(text: string, maxLength = 60): string {
  if (!text) {
    return '';
  }

  const slug = text
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // remove invalid chars
    .trim()
    .replace(/[\s_]+/g, '-') // collapse whitespace and underscores into hyphen
    .replace(/-+/g, '-'); // collapse multiple hyphens

  // Trim to maxLength without ending in a trailing hyphen
  let trimmed = slug.slice(0, maxLength);
  if (trimmed.endsWith('-')) {
    trimmed = trimmed.slice(0, -1);
  }

  return trimmed;
}
