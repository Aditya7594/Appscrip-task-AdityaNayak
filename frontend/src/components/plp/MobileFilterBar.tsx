'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { SortKey } from '@/types/plp';
import { Category } from '@/types/product';
import { usePlpNavigation } from '@/lib/url/use-plp-navigation';
import { ChevronIcon, CloseIcon, CheckIcon } from '@/components/ui/icons';
import { SORT_OPTIONS, SortOption } from './sort-options';
import { FilterDrawer } from './FilterDrawer';
import styles from './MobileFilterBar.module.css';

export interface MobileFilterBarProps {
  total: number;
  categories: Category[];
  currentSort?: SortKey;
  variant?: 'full' | 'compact';
}

/**
 * Responsive 41px filter bar with FILTER trigger (opens FilterDrawer)
 * and sort trigger (opens sort options bottom sheet <dialog>).
 * Visible below 1200px (full on mobile, compact on tablet).
 */
export function MobileFilterBar({
  total,
  categories,
  currentSort = 'recommended',
  variant = 'full',
}: MobileFilterBarProps) {
  const { query, navigate } = usePlpNavigation();
  const activeSort = query.sort || currentSort;

  // Filter drawer state & refs
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const filterBtnRef = useRef<HTMLButtonElement>(null);

  // Sort sheet dialog state & refs
  const sortDialogRef = useRef<HTMLDialogElement>(null);
  const sortBtnRef = useRef<HTMLButtonElement>(null);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const lockBodyScroll = useCallback(() => {
    document.body.style.overflow = 'hidden';
  }, []);

  const unlockBodyScroll = useCallback(() => {
    document.body.style.overflow = '';
  }, []);

  // Filter Drawer triggers
  const openFilterDrawer = useCallback(() => {
    setIsDrawerOpen(true);
  }, []);

  const closeFilterDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  // Sort Sheet triggers
  const openSortSheet = useCallback(() => {
    const dialog = sortDialogRef.current;
    if (!dialog) return;

    lockBodyScroll();
    setIsSortOpen(true);
    dialog.showModal();
  }, [lockBodyScroll]);

  const closeSortSheet = useCallback(() => {
    const dialog = sortDialogRef.current;
    if (dialog && dialog.open) {
      dialog.close();
    }
    unlockBodyScroll();
    setIsSortOpen(false);
    sortBtnRef.current?.focus();
  }, [unlockBodyScroll]);

  const handleSortCancel = useCallback(
    (e: React.SyntheticEvent) => {
      e.preventDefault();
      closeSortSheet();
    },
    [closeSortSheet]
  );

  const handleSortBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDialogElement>) => {
      if (e.target === sortDialogRef.current) {
        closeSortSheet();
      }
    },
    [closeSortSheet]
  );

  const handleSelectSort = useCallback(
    (option: SortOption) => {
      navigate({ sort: option.value, page: 1 });
      closeSortSheet();
    },
    [navigate, closeSortSheet]
  );

  // Clean up body scroll on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const currentOption =
    SORT_OPTIONS.find((opt) => opt.value === activeSort) || SORT_OPTIONS[0];

  return (
    <>
      <div
        className={`${styles.filterBar} ${
          variant === 'compact' ? styles.filterBarCompact : ''
        }`}
      >
        <button
          ref={filterBtnRef}
          type="button"
          className={styles.barBtn}
          onClick={openFilterDrawer}
          aria-haspopup="dialog"
          aria-expanded={isDrawerOpen}
        >
          <span>Filter</span>
        </button>

        <div className={styles.divider} aria-hidden="true" />

        <button
          ref={sortBtnRef}
          type="button"
          className={styles.barBtn}
          onClick={openSortSheet}
          aria-haspopup="dialog"
          aria-expanded={isSortOpen}
          aria-label={`Sort by: ${currentOption.label}`}
        >
          <span>{currentOption.label}</span>
          <ChevronIcon direction="down" className={styles.chevronIcon} />
        </button>
      </div>

      {/* Filter Drawer Dialog */}
      <FilterDrawer
        isOpen={isDrawerOpen}
        onClose={closeFilterDrawer}
        triggerRef={filterBtnRef}
        categories={categories}
        total={total}
      />

      {/* Sort Options Bottom Sheet Dialog */}
      <dialog
        ref={sortDialogRef}
        className={styles.sortSheetDialog}
        aria-label="Sort options"
        onCancel={handleSortCancel}
        onClick={handleSortBackdropClick}
      >
        <div className={styles.sortHeader}>
          <h2 className={styles.sortTitle}>Sort by</h2>
          <button
            type="button"
            className={styles.sortCloseBtn}
            aria-label="Close sort options"
            onClick={closeSortSheet}
          >
            <CloseIcon size={20} />
          </button>
        </div>

        <ul className={styles.sortOptionsList} role="listbox" aria-label="Sort options">
          {SORT_OPTIONS.map((opt) => {
            const isSelected = opt.value === activeSort;
            return (
              <li key={opt.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={`${styles.sortOptionItem} ${
                    isSelected ? styles.sortOptionSelected : ''
                  }`}
                  onClick={() => handleSelectSort(opt)}
                >
                  <span>{opt.label}</span>
                  {isSelected && <CheckIcon className={styles.sortCheckIcon} size={20} />}
                </button>
              </li>
            );
          })}
        </ul>
      </dialog>
    </>
  );
}
