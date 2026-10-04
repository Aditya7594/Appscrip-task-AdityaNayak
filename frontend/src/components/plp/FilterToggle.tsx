'use client';

import { usePlp } from './PlpContext';
import { ChevronIcon } from '@/components/ui/icons';
import styles from './FilterToggle.module.css';

export interface FilterToggleProps {
  variant?: 'desktop' | 'mobile';
}

export function FilterToggle({ variant = 'desktop' }: FilterToggleProps) {
  const { filtersOpen, toggleFilters } = usePlp();

  if (variant === 'mobile') {
    return (
      <button
        className={styles.mobileFilterBtn}
        type="button"
        aria-expanded={filtersOpen}
        aria-controls="filters"
        onClick={toggleFilters}
      >
        <span>Filter</span>
      </button>
    );
  }

  return (
    <button
      className={styles.filterToggle}
      type="button"
      aria-expanded={filtersOpen}
      aria-controls="filters"
      onClick={toggleFilters}
    >
      <ChevronIcon
        size={16}
        direction={filtersOpen ? 'left' : 'right'}
        className={styles.icon}
      />
      <span>{filtersOpen ? 'Hide filter' : 'Show filter'}</span>
    </button>
  );
}
