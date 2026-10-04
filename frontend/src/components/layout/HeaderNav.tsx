'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';

export interface NavItem {
  href: string;
  label: string;
}

export const NAV_LINKS: NavItem[] = [
  { href: '/products', label: 'SHOP' },
  { href: '/skills', label: 'SKILLS' },
  { href: '/stories', label: 'STORIES' },
  { href: '/about', label: 'ABOUT' },
  { href: '/contact', label: 'CONTACT US' },
];

export function HeaderNav() {
  const pathname = usePathname();

  const isLinkActive = (href: string): boolean => {
    if (!pathname) return false;
    if (href === '/products') {
      return pathname === '/products' || pathname.startsWith('/products/') || pathname === '/shop' || pathname === '/';
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav className={styles.headerNav} aria-label="Primary">
      <ul className={styles.navList}>
        {NAV_LINKS.map((link) => {
          const active = isLinkActive(link.href);
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`${styles.navLink} ${active ? styles.navLinkActive : ''}`}
                aria-current={active ? 'page' : undefined}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
