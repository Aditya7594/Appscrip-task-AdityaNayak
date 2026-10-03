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

export function FooterSection({ id, title, isBrandTitle, children }: FooterSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.section} data-open={isOpen ? 'true' : 'false'}>
      <div
        className={styles.sectionHeader}
        onClick={() => setIsOpen((prev) => !prev)}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-controls={id}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen((prev) => !prev);
          }
        }}
      >
        <h2 className={isBrandTitle ? styles.brandTitle : styles.sectionTitle}>
          {title}
        </h2>
        <button
          type="button"
          className={styles.toggleButton}
          aria-expanded={isOpen}
          aria-controls={id}
          aria-label={`Toggle ${title}`}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen((prev) => !prev);
          }}
        >
          <ChevronIcon
            direction={isOpen ? 'up' : 'down'}
            size={16}
            className={styles.toggleChevron}
          />
        </button>
      </div>
      <div id={id} className={styles.sectionPanel}>
        {children}
      </div>
    </div>
  );
}
