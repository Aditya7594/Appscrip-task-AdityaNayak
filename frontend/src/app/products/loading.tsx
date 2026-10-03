import React from 'react';
import { Breadcrumb, Hero, ProductGridSkeleton } from '@/components/plp';
import styles from './loading.module.css';

/**
 * Server component used by Next.js during initial page load/navigation to /products.
 * Renders Breadcrumb + Hero + toolbar skeleton + desktop sidebar placeholder + ProductGridSkeleton.
 */
export default function Loading() {
  return (
    <>
      <Breadcrumb />
      <div className="container">
        <Hero />
      <div className={styles.plpContainer}>
        {/* Toolbar skeleton */}
        <div className={styles.toolbarSkeleton} aria-hidden="true">
          <div className={styles.toolbarPlaceholder} />
          <div className={styles.toolbarPlaceholder} />
        </div>

        <div className={styles.layout}>
          {/* Sidebar skeleton (desktop) */}
          <aside className={styles.sidebarSkeleton} aria-hidden="true">
            <div className={styles.sidebarGroup}>
              <div className={styles.sidebarTitlePlaceholder} />
              <div className={styles.sidebarLinePlaceholder} />
            </div>
            <div className={styles.sidebarGroup}>
              <div className={styles.sidebarTitlePlaceholder} />
              <div className={styles.sidebarLinePlaceholder} />
            </div>
            <div className={styles.sidebarGroup}>
              <div className={styles.sidebarTitlePlaceholder} />
              <div className={styles.sidebarLinePlaceholder} />
            </div>
          </aside>

          {/* Product grid skeleton */}
          <div className={styles.results}>
            <ProductGridSkeleton count={12} />
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
