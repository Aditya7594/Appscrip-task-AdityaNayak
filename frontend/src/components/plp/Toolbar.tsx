import React from 'react';
import { SortKey } from '@/types/plp';
import { Category } from '@/types/product';
import { FilterToggle } from './FilterToggle';
import { SortDropdown } from './SortDropdown';
import { MobileFilterBar } from './MobileFilterBar';
import styles from './Toolbar.module.css';

export interface ToolbarProps {
  total: number;
  currentSort?: SortKey;
  categories?: Category[];
}

/**
 * Server component rendering the sticky toolbar with item count,
 * filter toggle, sort dropdown, mobile filter bar, and accessible live announcements.
 */
export function Toolbar({
  total,
  currentSort = 'recommended',
  categories = [],
}: ToolbarProps) {
  const formattedCount = total.toLocaleString('en-US');

  return (
    <div className={styles.toolbar}>
      {/* Responsive Filter Bar (< 1200px): count (visible 768-1199px) + mobile filter bar */}
      <div className={styles.responsiveContainer}>
        <p className={styles.responsiveCount}>
          <span>{formattedCount}</span> items
        </p>
        <MobileFilterBar
          total={total}
          currentSort={currentSort}
          categories={categories}
        />
      </div>

      {/* Desktop Toolbar Controls (>= 1200px): count + filter toggle (left), sort dropdown (right) */}
      <div className={styles.desktopLeft}>
        <p className={styles.count}>
          <span>{formattedCount}</span> items
        </p>
        <FilterToggle variant="desktop" />
      </div>

      <div className={styles.desktopRight}>
        <SortDropdown currentSort={currentSort} variant="desktop" />
      </div>

      {/* Accessible screen reader live announcement */}
      <div aria-live="polite" aria-atomic="true" className="visually-hidden">
        {formattedCount} products found
      </div>
    </div>
  );
}
