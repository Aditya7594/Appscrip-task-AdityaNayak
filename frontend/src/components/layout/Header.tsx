import React from 'react';
import Link from 'next/link';
import styles from './Header.module.css';
import {
  BrandMarkIcon,
  HamburgerIcon,
  SearchIcon,
  HeartIcon,
  BagIcon,
  ProfileIcon,
  ChevronIcon,
  Element4Icon,
} from '@/components/ui/icons';

const NAV_LINKS = [
  { href: '/shop', label: 'SHOP' },
  { href: '/skills', label: 'SKILLS' },
  { href: '/stories', label: 'STORIES' },
  { href: '/about', label: 'ABOUT' },
  { href: '/contact', label: 'CONTACT US' },
];

export function Header() {
  return (
    <header className={styles.siteHeader}>
      {/* Top Strip */}
      <div className={styles.topStrip}>
        <p className={styles.topStripItem}>
          <Element4Icon className={styles.stripIcon} size={16} />
          <span>Lorem ipsum dolor</span>
        </p>
        <p className={styles.topStripItem}>
          <Element4Icon className={styles.stripIcon} size={16} />
          <span>Lorem ipsum dolor</span>
        </p>
        <p className={styles.topStripItem}>
          <Element4Icon className={styles.stripIcon} size={16} />
          <span>Lorem ipsum dolor</span>
        </p>
      </div>

      {/* Main Header */}
      <div className={styles.headerMain}>
        {/* Mobile Hamburger Button */}
        <button
          className={styles.headerHamburger}
          type="button"
          aria-label="Open navigation menu"
        >
          <HamburgerIcon className={styles.hamburgerIcon} size={20} />
        </button>

        {/* Brand Mark Link */}
        <Link href="/" className={styles.brandMark} aria-label="Home">
          <BrandMarkIcon className={styles.brandMarkIcon} size={36} />
        </Link>

        {/* Logo Link */}
        <Link href="/" className={styles.logo}>
          LOGO
        </Link>

        {/* Header Tools */}
        <div className={styles.headerTools}>
          <button type="button" className={styles.toolItem} aria-label="Search">
            <SearchIcon className={styles.toolIcon} size={24} />
          </button>

          <Link href="/wishlist" className={styles.toolItem} aria-label="Wishlist">
            <HeartIcon className={styles.toolIcon} size={24} />
          </Link>

          <Link href="/cart" className={styles.toolItem} aria-label="Shopping bag">
            <BagIcon className={styles.toolIcon} size={24} />
          </Link>

          <Link
            href="/profile"
            className={`${styles.toolItem} ${styles.toolItemProfile}`}
            aria-label="Profile"
          >
            <ProfileIcon className={styles.toolIcon} size={24} />
          </Link>

          <button type="button" className={styles.langSwitch} aria-label="Language: English">
            <span>ENG</span>
            <ChevronIcon direction="down" size={16} className={styles.langChevron} />
          </button>
        </div>

        {/* Primary Navigation */}
        <nav className={styles.headerNav} aria-label="Primary">
          <ul className={styles.navList}>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={styles.navLink}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
