'use client';

import React, { useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { HamburgerIcon, CloseIcon } from '@/components/ui/icons';
import styles from './MobileMenu.module.css';

const NAV_LINKS = [
  { href: '/products', label: 'SHOP' },
  { href: '/skills', label: 'SKILLS' },
  { href: '/stories', label: 'STORIES' },
  { href: '/about', label: 'ABOUT' },
  { href: '/contact', label: 'CONTACT US' },
];

/**
 * Mobile menu drawer built on the native <dialog> element.
 * Provides focus trapping, Escape handling, and returns focus to hamburger on close.
 * Rendered only below 1200px.
 */
export function MobileMenu() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  const lockBodyScroll = useCallback(() => {
    document.body.style.overflow = 'hidden';
  }, []);

  const unlockBodyScroll = useCallback(() => {
    document.body.style.overflow = '';
  }, []);

  const openMenu = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    lockBodyScroll();
    dialog.showModal();
  }, [lockBodyScroll]);

  const closeMenu = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (dialog.open) {
      dialog.close();
    }
    unlockBodyScroll();
    hamburgerRef.current?.focus();
  }, [unlockBodyScroll]);

  const handleCancel = useCallback(
    (e: React.SyntheticEvent) => {
      e.preventDefault();
      closeMenu();
    },
    [closeMenu]
  );

  // Close when clicking the dialog backdrop
  const handleDialogClick = useCallback(
    (e: React.MouseEvent<HTMLDialogElement>) => {
      if (e.target === dialogRef.current) {
        closeMenu();
      }
    },
    [closeMenu]
  );

  // Safety cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className={styles.mobileMenuContainer}>
      <button
        ref={hamburgerRef}
        type="button"
        className={styles.hamburgerBtn}
        aria-label="Open menu"
        onClick={openMenu}
      >
        <HamburgerIcon size={20} />
      </button>

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-label="Navigation menu"
        onCancel={handleCancel}
        onClick={handleDialogClick}
      >
        <div className={styles.dialogHeader}>
          <span className={styles.dialogTitle}>LOGO</span>
          <button
            type="button"
            className={styles.closeBtn}
            aria-label="Close menu"
            onClick={closeMenu}
          >
            <CloseIcon size={20} />
          </button>
        </div>

        <nav className={styles.menuNav} aria-label="Primary">
          <ul className={styles.navList}>
            {NAV_LINKS.map((link) => (
              <li key={link.href} className={styles.navItem}>
                <Link
                  href={link.href}
                  className={styles.navLink}
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </dialog>
    </div>
  );
}
