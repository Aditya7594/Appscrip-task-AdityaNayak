'use client';

import React, { useState } from 'react';
import styles from './Footer.module.css';
import { ChevronIcon } from '@/components/ui/icons';

export interface FooterSectionProps {
  id: string;
  title: string;
  isBrandTitle?: boolean;
  children: React.ReactNode;
}

/**
 * Accessible mobile accordion / desktop static list section.
 * On mobile (< 768px): Button toggles panel and uses hidden attribute to remove inactive items from tab order.
 * On tablet/desktop (>= 768px): CSS overrides display: block !important and removes accordion interactions.
 */
export function FooterSection({ id, title, isBrandTitle, children }: FooterSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.section} data-open={isOpen ? 'true' : 'false'}>
      <h2 className={isBrandTitle ? styles.brandTitle : styles.sectionTitle}>
        <button
          type="button"
          className={styles.sectionHeaderBtn}
          aria-expanded={isOpen}
          aria-controls={id}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span>{title}</span>
          <ChevronIcon
            direction={isOpen ? 'up' : 'down'}
            size={16}
            aria-hidden="true"
            className={styles.toggleChevron}
          />
        </button>
      </h2>
      <div id={id} className={styles.sectionPanel} hidden={!isOpen}>
        {children}
      </div>
    </div>
  );
}
