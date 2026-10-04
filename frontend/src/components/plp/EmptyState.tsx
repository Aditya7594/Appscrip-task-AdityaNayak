import Link from 'next/link';
import styles from './EmptyState.module.css';

/**
 * Centered empty state rendered inside the results area when total products is 0.
 * Includes accessible role="status", descriptive helper message, and "Clear all filters" link.
 */
export function EmptyState() {
  return (
    <div role="status" className={styles.emptyState}>
      <h2 className={styles.title}>No products match your filters</h2>
      <p className={styles.helperText}>
        We couldn&apos;t find any items matching your selected criteria. Try adjusting or clearing your filters to explore all available products.
      </p>
      <Link href="/products" className={styles.clearLink}>
        Clear all filters
      </Link>
    </div>
  );
}
