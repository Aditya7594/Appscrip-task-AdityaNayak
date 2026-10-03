'use client';

import React, { createContext, useContext } from 'react';
import { PlpQuery } from '@/types/plp';

export interface PlpContextValue {
  filtersOpen: boolean;
  setFiltersOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleFilters: () => void;
  query: PlpQuery;
  navigate: (patch: Partial<PlpQuery>) => void;
  isPending: boolean;
}

export const PlpContext = createContext<PlpContextValue | null>(null);

/**
 * Access the PLP context provided by PlpShell.
 */
export function usePlp(): PlpContextValue {
  const context = useContext(PlpContext);
  if (!context) {
    throw new Error('usePlp must be used within PlpShell');
  }
  return context;
}
