import React from 'react';
import Link from 'next/link';
import styles from './Breadcrumb.module.css';

/**
 * Server component rendering mobile breadcrumb navigation (< 768px).
 * Displays: HOME > SHOP with aria-current="page" on SHOP.
 */
export function Breadcrumb() {
  return (
    <nav className={styles.breadcrumb} aria-label="Breadcrumb">
      <ol className={styles.breadcrumbList}>
        <li className={styles.breadcrumbItem}>
          <Link href="/" className={styles.breadcrumbLink}>
            HOME
          </Link>
        </li>
        <li className={styles.breadcrumbSeparator} aria-hidden="true">
          &gt;
        </li>
        <li className={styles.breadcrumbItem}>
          <span className={styles.breadcrumbCurrent} aria-current="page">
            SHOP
          </span>
        </li>
      </ol>
    </nav>
  );
}
