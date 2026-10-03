'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { Category } from '@/types/product';
import { usePlpNavigation } from '@/lib/url/use-plp-navigation';
import { FilterSidebar } from './FilterSidebar';
import { CloseIcon } from '@/components/ui/icons';
import styles from './FilterDrawer.module.css';

export interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
  categories: Category[];
  total: number;
}

/**
 * Off-canvas filter drawer built on native <dialog> element.
 * Reuses FilterSidebar, traps focus, supports Escape, and locks body scroll.
 * Used for mobile (< 768px) and tablet (< 1200px).
 */
export function FilterDrawer({
  isOpen,
  onClose,
  triggerRef,
  categories,
  total,
}: FilterDrawerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { navigate } = usePlpNavigation();

  const lockBodyScroll = useCallback(() => {
    document.body.style.overflow = 'hidden';
  }, []);

  const unlockBodyScroll = useCallback(() => {
    document.body.style.overflow = '';
  }, []);

  const handleClose = useCallback(() => {
    const dialog = dialogRef.current;
    if (dialog && dialog.open) {
      dialog.close();
    }
    unlockBodyScroll();
    onClose();
    triggerRef?.current?.focus();
  }, [onClose, triggerRef, unlockBodyScroll]);

  // Sync open state with native <dialog>
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      lockBodyScroll();
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
      unlockBodyScroll();
    }
  }, [isOpen, lockBodyScroll, unlockBodyScroll]);

  // Handle Escape key
  const handleCancel = useCallback(
    (e: React.SyntheticEvent) => {
      e.preventDefault();
      handleClose();
    },
    [handleClose]
  );

  // Close when clicking the backdrop
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDialogElement>) => {
      if (e.target === dialogRef.current) {
        handleClose();
      }
    },
    [handleClose]
  );

  const handleClearAll = useCallback(() => {
    navigate({
      category: [],
      minPrice: undefined,
      maxPrice: undefined,
      minRating: undefined,
      page: 1,
    });
  }, [navigate]);

  // Clean up body scroll on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-label="Filter products"
      onCancel={handleCancel}
      onClick={handleBackdropClick}
    >
      <div className={styles.header}>
        <h2 className={styles.title}>Filters</h2>
        <button
          type="button"
          className={styles.closeBtn}
          aria-label="Close filters"
          onClick={handleClose}
        >
          <CloseIcon size={20} />
        </button>
      </div>

      <div className={styles.content}>
        <FilterSidebar categories={categories} />
      </div>

      <div className={styles.bottomBar}>
        <button
          type="button"
          className={styles.clearBtn}
          onClick={handleClearAll}
        >
          Clear all
        </button>
        <button
          type="button"
          className={styles.applyBtn}
          onClick={handleClose}
        >
          Show {total} results
        </button>
      </div>
    </dialog>
  );
}
