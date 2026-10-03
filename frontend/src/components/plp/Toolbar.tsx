import React from 'react';
import { SortKey } from '@/types/plp';
import { FilterToggle } from './FilterToggle';
import { SortDropdown } from './SortDropdown';
import styles from './Toolbar.module.css';

export interface ToolbarProps {
  total: number;
  currentSort?: SortKey;
}

/**
 * Server component rendering the sticky toolbar with item count,
 * filter toggle, sort dropdown, and accessible live announcements.
 */
export function Toolbar({ total, currentSort = 'recommended' }: ToolbarProps) {
  const formattedCount = total.toLocaleString('en-US');

  return (
    <div className={styles.toolbar}>
      {/* Mobile Filter Bar (<= 767px) */}
      <div className={styles.mobileBar}>
        <span className="visually-hidden">{formattedCount} items</span>
        <FilterToggle variant="mobile" />
        <div className={styles.divider} aria-hidden="true" />
        <SortDropdown currentSort={currentSort} variant="mobile" />
      </div>

      {/* Desktop & Tablet Toolbar Controls (>= 768px) */}
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
