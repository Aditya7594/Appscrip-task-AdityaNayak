'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { PlpContext } from './PlpContext';
import { usePlpNavigationBase } from '@/lib/url/use-plp-navigation';
import styles from './PlpShell.module.css';

export interface PlpShellProps {
  toolbar?: React.ReactNode;
  sidebar?: React.ReactNode;
  children: React.ReactNode;
}

export function PlpShell({ toolbar, sidebar, children }: PlpShellProps) {
  const [filtersOpen, setFiltersOpen] = useState(true);
  const navigation = usePlpNavigationBase();

  const toggleFilters = useCallback(() => {
    setFiltersOpen((prev) => !prev);
  }, []);

  const contextValue = useMemo(
    () => ({
      filtersOpen,
      setFiltersOpen,
      toggleFilters,
      query: navigation.query,
      navigate: navigation.navigate,
      isPending: navigation.isPending,
    }),
    [filtersOpen, toggleFilters, navigation.query, navigation.navigate, navigation.isPending],
  );

  return (
    <PlpContext.Provider value={contextValue}>
      <div className={styles.shellWrapper}>
        {toolbar}
        <div
          className={styles.layout}
          data-filters={filtersOpen ? 'open' : 'hidden'}
          aria-busy={navigation.isPending}
        >
          {sidebar}
          <div className={styles.results} data-results>
            {children}
          </div>
        </div>
      </div>
    </PlpContext.Provider>
  );
}
