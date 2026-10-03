'use client';

import React, { useState, useId } from 'react';
import { ChevronIcon } from '@/components/ui/icons';
import styles from './FilterGroup.module.css';

export interface FilterGroupProps {
  title: string;
  selectedLabels?: string[];
  defaultOpen?: boolean;
  onReset?: () => void;
  children: React.ReactNode;
}

export function FilterGroup({
  title,
  selectedLabels = [],
  defaultOpen = false,
  onReset,
  children,
}: FilterGroupProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentId = useId();

  const hasSelection = selectedLabels.length > 0;
  const summaryText = hasSelection ? selectedLabels.join(', ') : 'All';

  const toggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <fieldset className={styles.group}>
      <legend className={styles.legend}>
        <button
          type="button"
          className={styles.toggleBtn}
          aria-expanded={isOpen}
          aria-controls={contentId}
          onClick={toggle}
        >
          <span className={styles.title}>{title}</span>
          <ChevronIcon
            size={16}
            direction={isOpen ? 'up' : 'down'}
            className={styles.chevron}
          />
        </button>
      </legend>

      <p className={styles.summary} title={summaryText}>
        {summaryText}
      </p>

      <div
        id={contentId}
        className={styles.content}
        hidden={!isOpen}
      >
        {hasSelection && onReset && (
          <button
            type="button"
            className={styles.resetBtn}
            onClick={onReset}
          >
            Unselect all
          </button>
        )}
        <div className={styles.options}>{children}</div>
      </div>
    </fieldset>
  );
}
