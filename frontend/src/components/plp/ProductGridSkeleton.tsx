import styles from './ProductGridSkeleton.module.css';

export interface ProductGridSkeletonProps {
  count?: number;
}

/**
 * Server component rendering 12 skeleton product cards with exact geometry
 * (3:4 image box + two text lines) and a soft shimmer animation.
 * The shimmer is automatically disabled under prefers-reduced-motion.
 */
export function ProductGridSkeleton({ count = 12 }: ProductGridSkeletonProps) {
  const items = Array.from({ length: count }, (_, i) => i);

  return (
    <div
      role="status"
      aria-busy="true"
      className={styles.skeletonResults}
      aria-label="Loading products"
    >
      <span className="visually-hidden">Loading products</span>
      <ul className={styles.skeletonGrid} aria-hidden="true">
        {items.map((i) => (
          <li key={i} className={styles.skeletonCard}>
            <div className={`${styles.mediaBox} ${styles.shimmer}`} />
            <div className={styles.body}>
              <div className={`${styles.titleLine} ${styles.shimmer}`} />
              <div className={`${styles.subtitleLine} ${styles.shimmer}`} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
