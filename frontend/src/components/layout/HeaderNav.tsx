'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';

export interface NavItem {
  href: string;
  label: string;
}

export const NAV_LINKS: NavItem[] = [
  { href: '/products', label: 'SHOP' },
  { href: '#', label: 'SKILLS' },
  { href: '#', label: 'STORIES' },
  { href: '#', label: 'ABOUT' },
  { href: '#', label: 'CONTACT US' },
];

export function HeaderNav() {
  const pathname = usePathname();

  const isLinkActive = (href: string): boolean => {
    if (!pathname || href === '#') return false;
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
            <li key={link.label}>
              <Link
                href={link.href}
                className={`${styles.navLink} ${active ? styles.navLinkActive : ''}`}
                aria-current={active ? 'page' : undefined}
                onClick={(e) => {
                  if (link.href === '#') {
                    e.preventDefault();
                  }
                }}
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
