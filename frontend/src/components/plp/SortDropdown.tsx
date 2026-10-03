'use client';

import React, { useState, useRef, useEffect, useId, useCallback } from 'react';
import { SortKey } from '@/types/plp';
import { usePlpNavigation } from '@/lib/url/use-plp-navigation';
import { ChevronIcon, CheckIcon } from '@/components/ui/icons';
import styles from './SortDropdown.module.css';
import { SORT_OPTIONS, type SortOption } from './sort-options';

export { SORT_OPTIONS, type SortOption };

export interface SortDropdownProps {
  currentSort?: SortKey;
  variant?: 'desktop' | 'mobile';
}

export function SortDropdown({ currentSort: propSort, variant = 'desktop' }: SortDropdownProps) {
  const { query, navigate } = usePlpNavigation();
  const currentSort = propSort || query.sort || 'recommended';

  const [isOpen, setIsOpen] = useState(false);
  const selectedIndex = SORT_OPTIONS.findIndex((opt) => opt.value === currentSort);
  const initialActive = selectedIndex >= 0 ? selectedIndex : 0;
  const [activeIndex, setActiveIndex] = useState(initialActive);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  const idPrefix = useId();
  const triggerId = `${idPrefix}-sort-trigger`;
  const listboxId = `${idPrefix}-sort-listbox`;

  const currentOption = SORT_OPTIONS.find((opt) => opt.value === currentSort) || SORT_OPTIONS[0];

  const openMenu = useCallback(() => {
    const idx = SORT_OPTIONS.findIndex((opt) => opt.value === currentSort);
    setActiveIndex(idx >= 0 ? idx : 0);
    setIsOpen(true);
  }, [currentSort]);

  // Click outside to close
  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isOpen]);

  const selectOption = useCallback(
    (value: SortKey) => {
      setIsOpen(false);
      navigate({ sort: value });
      triggerRef.current?.focus();
    },
    [navigate],
  );

  const handleTriggerClick = () => {
    if (isOpen) {
      setIsOpen(false);
    } else {
      openMenu();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (
        e.key === 'ArrowDown' ||
        e.key === 'ArrowUp' ||
        e.key === 'Enter' ||
        e.key === ' '
      ) {
        e.preventDefault();
        openMenu();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % SORT_OPTIONS.length);
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + SORT_OPTIONS.length) % SORT_OPTIONS.length);
        break;
      }
      case 'Home': {
        e.preventDefault();
        setActiveIndex(0);
        break;
      }
      case 'End': {
        e.preventDefault();
        setActiveIndex(SORT_OPTIONS.length - 1);
        break;
      }
      case 'Enter':
      case ' ': {
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < SORT_OPTIONS.length) {
          selectOption(SORT_OPTIONS[activeIndex].value);
        }
        break;
      }
      case 'Escape': {
        e.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
        break;
      }
      case 'Tab': {
        // Tab closes menu and moves focus naturally
        setIsOpen(false);
        break;
      }
      default:
        break;
    }
  };

  const activeOptionId =
    isOpen && activeIndex >= 0
      ? `${idPrefix}-opt-${SORT_OPTIONS[activeIndex].value}`
      : undefined;

  const isMobile = variant === 'mobile';

  return (
    <div
      ref={containerRef}
      className={`${styles.sortWrapper} ${isMobile ? styles.sortMobile : styles.sortDesktop}`}
      onKeyDown={handleKeyDown}
    >
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        className={isMobile ? styles.mobileTrigger : styles.sortTrigger}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        onClick={handleTriggerClick}
      >
        <span>{currentOption.label}</span>
        <ChevronIcon
          size={16}
          direction={isOpen ? 'up' : 'down'}
          className={styles.chevronIcon}
        />
      </button>

      {isOpen && (
        <ul
          ref={listboxRef}
          id={listboxId}
          role="listbox"
          tabIndex={-1}
          aria-labelledby={triggerId}
          aria-activedescendant={activeOptionId}
          className={`${styles.sortMenu} ${isMobile ? styles.mobileMenu : ''}`}
        >
          {SORT_OPTIONS.map((option, index) => {
            const isSelected = option.value === currentSort;
            const isActive = index === activeIndex;
            const optId = `${idPrefix}-opt-${option.value}`;

            return (
              <li
                key={option.value}
                id={optId}
                role="option"
                aria-selected={isSelected}
                data-active={isActive ? 'true' : undefined}
                className={`${styles.sortItem} ${isSelected ? styles.sortItemSelected : ''}`}
                onClick={() => selectOption(option.value)}
                onMouseEnter={() => setActiveIndex(index)}
              >
                {isSelected && (
                  <CheckIcon
                    size={26}
                    aria-hidden="true"
                    className={styles.checkIcon}
                  />
                )}
                <span>{option.label}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
