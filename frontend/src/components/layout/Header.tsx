import Link from 'next/link';
import styles from './Header.module.css';
import {
  BrandMarkIcon,
  SearchIcon,
  HeartIcon,
  BagIcon,
  ProfileIcon,
  ChevronIcon,
  Element4Icon,
} from '@/components/ui/icons';
import { MobileMenu } from './MobileMenu';
import { HeaderNav } from './HeaderNav';

export function Header() {
  return (
    <header className={styles.siteHeader}>
      {/* Top Strip */}
      <div className={styles.topStrip}>
        <div className={styles.topStripContainer}>
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
      </div>

      {/* Main Header */}
      <div className={styles.headerMain}>
        <div className={styles.headerContainer}>
          {/* Mobile Navigation Drawer & Hamburger Trigger */}
          <MobileMenu />

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

            <Link
              href="#"
              className={styles.toolItem}
              aria-label="Wishlist (In development)"
            >
              <HeartIcon className={styles.toolIcon} size={24} />
            </Link>

            <Link
              href="#"
              className={styles.toolItem}
              aria-label="Shopping bag (In development)"
            >
              <BagIcon className={styles.toolIcon} size={24} />
            </Link>

            <Link
              href="#"
              className={`${styles.toolItem} ${styles.toolItemProfile}`}
              aria-label="Profile (In development)"
            >
              <ProfileIcon className={styles.toolIcon} size={24} />
            </Link>

            <button type="button" className={styles.langSwitch} aria-label="Language: English">
              <span>ENG</span>
              <ChevronIcon direction="down" size={16} className={styles.langChevron} />
            </button>
          </div>

          {/* Primary Navigation */}
          <HeaderNav />
        </div>
      </div>
    </header>
  );
}
