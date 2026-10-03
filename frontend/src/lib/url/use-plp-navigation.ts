'use client';

import { useTransition, useMemo, useCallback, useContext } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PlpQuery } from '@/types/plp';
import { parsePlpSearchParams, buildPlpHref } from './plp-params';
import { PlpContext } from '@/components/plp/PlpContext';

export interface UsePlpNavigationReturn {
  query: PlpQuery;
  navigate: (patch: Partial<PlpQuery>) => void;
  isPending: boolean;
}

/**
 * Base implementation of PLP navigation using useTransition and useRouter.
 * Used internally by PlpShell or standalone components.
 */
export function usePlpNavigationBase(): UsePlpNavigationReturn {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const query = useMemo(() => {
    return parsePlpSearchParams(searchParams);
  }, [searchParams]);

  const navigate = useCallback(
    (patch: Partial<PlpQuery>) => {
      const href = buildPlpHref(query, patch);
      startTransition(() => {
        router.push(href, { scroll: false });
      });
    },
    [query, router],
  );

  return {
    query,
    navigate,
    isPending,
  };
}

/**
 * Client hook returning { query, navigate(patch), isPending }.
 * Reads current URL state with useSearchParams, builds href with buildPlpHref,
 * and calls router.push(href, { scroll: false }) inside useTransition.
 * If used within PlpShell, shares unified pending state so the shell can dim the results area.
 */
export function usePlpNavigation(): UsePlpNavigationReturn {
  const ctx = useContext(PlpContext);
  const base = usePlpNavigationBase();

  if (ctx && ctx.navigate) {
    return {
      query: ctx.query,
      navigate: ctx.navigate,
      isPending: ctx.isPending,
    };
  }

  return base;
}
