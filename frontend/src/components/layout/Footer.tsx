import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';
import { FooterSection } from './FooterSection';
import { InstagramIcon, LinkedInIcon } from '@/components/ui/icons';

const METTA_LINKS = [
  { href: '/about', label: 'About Us' },
  { href: '/stories', label: 'Stories' },
  { href: '/artisans', label: 'Artisans' },
  { href: '/boutiques', label: 'Boutiques' },
  { href: '/contact', label: 'Contact Us' },
  { href: '/eu-compliances', label: 'EU Compliances Docs' },
];

const QUICK_LINKS = [
  { href: '/orders', label: 'Orders & Shipping' },
  { href: '/sellers', label: 'Join/Login as a Seller' },
  { href: '/pricing', label: 'Payment & Pricing' },
  { href: '/returns', label: 'Return & Refunds' },
  { href: '/faqs', label: 'FAQs' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms & Conditions' },
];

const PAYMENT_BADGES = [
  { name: 'Google Pay', src: '/payments/google-pay.svg' },
  { name: 'Mastercard', src: '/payments/mastercard.svg' },
  { name: 'PayPal', src: '/payments/paypal.svg' },
  { name: 'American Express', src: '/payments/american-express.svg' },
  { name: 'Apple Pay', src: '/payments/apple-pay.svg' },
  { name: 'Shop Pay', src: '/payments/shop-pay.svg' },
];

function CurrencyFlag() {
  return (
    <svg
      className={styles.currencyFlag}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <clipPath id="flag-circle">
        <circle cx="12" cy="12" r="12" />
      </clipPath>
      <g clipPath="url(#flag-circle)">
        <rect width="24" height="24" fill="#B22234" />
        <path
          d="M0 3.7h24v1.8H0zm0 3.7h24v1.8H0zm0 3.7h24v1.8H0zm0 3.7h24v1.8H0zm0 3.7h24v1.8H0zm0 3.7h24v1.8H0z"
          fill="#FFFFFF"
        />
        <rect width="11" height="13" fill="#3C3B6E" />
        <circle cx="2.5" cy="3" r="0.75" fill="#FFFFFF" />
        <circle cx="5.5" cy="3" r="0.75" fill="#FFFFFF" />
        <circle cx="8.5" cy="3" r="0.75" fill="#FFFFFF" />
        <circle cx="4" cy="5.5" r="0.75" fill="#FFFFFF" />
        <circle cx="7" cy="5.5" r="0.75" fill="#FFFFFF" />
        <circle cx="2.5" cy="8" r="0.75" fill="#FFFFFF" />
        <circle cx="5.5" cy="8" r="0.75" fill="#FFFFFF" />
        <circle cx="8.5" cy="8" r="0.75" fill="#FFFFFF" />
        <circle cx="4" cy="10.5" r="0.75" fill="#FFFFFF" />
        <circle cx="7" cy="10.5" r="0.75" fill="#FFFFFF" />
      </g>
    </svg>
  );
}

export function Footer() {
  return (
    <footer className={styles.siteFooter}>
      <div className={styles.footerContainer}>
        {/* Top Area */}
        <div className={styles.footerTop}>
          {/* Column 1: Newsletter */}
          <div className={styles.newsletterCol}>
            <h2 className={styles.footerTitle}>Be the first to know</h2>
            <p className={styles.newsletterText}>Sign up for updates from mettā muse.</p>
            <form className={styles.newsletterForm} action="#" method="post">
              <label className="visually-hidden" htmlFor="footer-email">
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                placeholder="Enter your e-mail..."
                autoComplete="email"
                required
                className={styles.newsletterInput}
              />
              <p id="subscribe-disabled-note" className="visually-hidden">
                Newsletter subscription is currently unavailable in this demonstration
              </p>
              <button
                type="submit"
                disabled
                aria-describedby="subscribe-disabled-note"
                className={styles.newsletterButton}
              >
                Subscribe
              </button>
            </form>
          </div>

          <hr className={styles.mobileDivider} />

          {/* Column 2 (Mobile only): Contact & Currency */}
          <div className={styles.contactCol}>
            <h2 className={styles.footerTitle}>
              <span className={styles.contactTitleMobile}>Call Us</span>
              <span className={styles.contactTitleDesktop}>Contact us</span>
            </h2>

            <div className={styles.contactRow}>
              <a href="tel:+442211335360" className={styles.contactLink}>
                +44 221 133 5360
              </a>
              <span className={styles.contactDot} aria-hidden="true">
                &#9670;
              </span>
              <a href="mailto:customercare@mettamuse.com" className={styles.contactLink}>
                customercare@mettamuse.com
              </a>
            </div>

            <hr className={styles.mobileDivider} />

            <h2 className={`${styles.footerTitle} ${styles.footerTitleSpaced}`}>Currency</h2>
            <div className={styles.currencyRow}>
              <CurrencyFlag />
              <span className={styles.currencyDot} aria-hidden="true" />
              <span className={styles.currencyCode}>USD</span>
            </div>
            <p className={styles.currencyNote}>
              Transactions will be completed in Euros and a currency reference is available on
              hover.
            </p>
          </div>
        </div>

        {/* 1px Desktop Horizontal Divider */}
        <hr className={styles.desktopDivider} />
        <hr className={styles.mobileDivider} />

        {/* Bottom Area */}
        <div className={styles.footerBottom}>
          {/* Column 1: mettā muse */}
          <div>
            <FooterSection id="footer-metta" title="mettā muse" isBrandTitle>
              <nav aria-label="Company">
                <ul className={styles.footerLinks}>
                  {METTA_LINKS.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className={styles.footerLink}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </FooterSection>
            <hr className={styles.mobileDivider} />
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <FooterSection id="footer-quick" title="Quick links">
              <nav aria-label="Customer service">
                <ul className={styles.footerLinks}>
                  {QUICK_LINKS.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className={styles.footerLink}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </FooterSection>
            <hr className={styles.mobileDivider} />
          </div>

          {/* Column 3: Follow us & Payments */}
          <div>
            <FooterSection id="footer-follow" title="Follow us">
              <div className={styles.footerSocial}>
                <a
                  href="https://instagram.com/mettamuse"
                  className={styles.socialLink}
                  aria-label="Follow mettā muse on Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <InstagramIcon size={16} className={styles.socialIcon} />
                </a>
                <a
                  href="https://linkedin.com/company/mettamuse"
                  className={styles.socialLink}
                  aria-label="Follow mettā muse on LinkedIn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LinkedInIcon size={16} className={styles.socialIcon} />
                </a>
              </div>
            </FooterSection>

            <hr className={styles.mobileDivider} />

            <div className={styles.paymentSection}>
              <h2 className={`${styles.footerTitle} ${styles.footerTitleSpaced}`}>
                mettā muse accepts
              </h2>
              <div className={styles.paymentsGrid}>
                {PAYMENT_BADGES.map((badge) => (
                  <Image
                    key={badge.name}
                    src={badge.src}
                    alt={badge.name}
                    width={56}
                    height={35}
                    className={styles.paymentBadge}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Centered Copyright */}
        <p className={styles.footerCopyright}>Copyright &copy; 2023 mettamuse. All rights reserved.</p>
      </div>
    </footer>
  );
}
