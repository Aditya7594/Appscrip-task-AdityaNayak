'use client';

import React, { useCallback, useMemo } from 'react';
import { Category } from '@/types/product';
import { usePlpNavigation } from '@/lib/url/use-plp-navigation';
import {
  PRICE_RANGES,
  PriceRange,
  findMatchingPriceRange,
  RATING_OPTIONS,
} from '@/lib/url/price-ranges';
import { FilterGroup } from './FilterGroup';
import { Checkbox } from '@/components/ui/Checkbox';
import styles from './FilterSidebar.module.css';

export interface FilterSidebarProps {
  categories: Category[];
  id?: string;
}

export function FilterSidebar({ categories, id = 'filters' }: FilterSidebarProps) {
  const { query, navigate } = usePlpNavigation();
  const isDesktop = id === 'filters';
  const prefix = isDesktop ? 'filter' : `${id}-filter`;

  // Category selection & labels
  const selectedCategorySlugs = useMemo(() => {
    return query.category || [];
  }, [query.category]);

  const selectedCategoryLabels = useMemo(() => {
    return categories
      .filter((c) => selectedCategorySlugs.includes(c.slug))
      .map((c) => c.name);
  }, [categories, selectedCategorySlugs]);

  const toggleCategory = useCallback(
    (slug: string) => {
      const isSelected = selectedCategorySlugs.includes(slug);
      const nextCategories = isSelected
        ? selectedCategorySlugs.filter((s) => s !== slug)
        : [...selectedCategorySlugs, slug];
      navigate({ category: nextCategories });
    },
    [selectedCategorySlugs, navigate],
  );

  const resetCategories = useCallback(() => {
    navigate({ category: [] });
  }, [navigate]);

  // Price range selection & labels
  const matchedPriceRange = useMemo(() => {
    return findMatchingPriceRange(query.minPrice, query.maxPrice);
  }, [query.minPrice, query.maxPrice]);

  const selectedPriceLabels = useMemo(() => {
    return matchedPriceRange ? [matchedPriceRange.label] : [];
  }, [matchedPriceRange]);

  const togglePriceRange = useCallback(
    (range: PriceRange) => {
      const isSelected = matchedPriceRange?.id === range.id;
      if (isSelected) {
        navigate({ minPrice: undefined, maxPrice: undefined });
      } else {
        navigate({ minPrice: range.min, maxPrice: range.max });
      }
    },
    [matchedPriceRange, navigate],
  );

  const resetPrice = useCallback(() => {
    navigate({ minPrice: undefined, maxPrice: undefined });
  }, [navigate]);

  // Rating selection & labels
  const matchedRatingOption = useMemo(() => {
    return RATING_OPTIONS.find((r) => r.minRating === query.minRating);
  }, [query.minRating]);

  const selectedRatingLabels = useMemo(() => {
    return matchedRatingOption ? [matchedRatingOption.label] : [];
  }, [matchedRatingOption]);

  const toggleRating = useCallback(
    (minRating: number) => {
      const isSelected = query.minRating === minRating;
      if (isSelected) {
        navigate({ minRating: undefined });
      } else {
        navigate({ minRating });
      }
    },
    [query.minRating, navigate],
  );

  const resetRating = useCallback(() => {
    navigate({ minRating: undefined });
  }, [navigate]);

  return (
    <aside id={id} className={styles.filters} aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="visually-hidden">
        Filters
      </h2>

      {/* 1. CATEGORY Group (multi-select, default open) */}
      <FilterGroup
        title="CATEGORY"
        selectedLabels={selectedCategoryLabels}
        defaultOpen={true}
        onReset={resetCategories}
      >
        {categories.map((cat) => (
          <Checkbox
            key={cat.id}
            id={`${prefix}-cat-${cat.slug}`}
            name="category"
            value={cat.slug}
            checked={selectedCategorySlugs.includes(cat.slug)}
            onChange={() => toggleCategory(cat.slug)}
            label={cat.name}
            count={cat.productCount}
          />
        ))}
      </FilterGroup>

      <hr className={styles.divider} />

      {/* 2. PRICE Group (single-select range, default closed) */}
      <FilterGroup
        title="PRICE"
        selectedLabels={selectedPriceLabels}
        defaultOpen={false}
        onReset={resetPrice}
      >
        {PRICE_RANGES.map((range) => (
          <Checkbox
            key={range.id}
            id={`${prefix}-price-${range.id}`}
            name="price-range"
            value={range.id}
            checked={matchedPriceRange?.id === range.id}
            onChange={() => togglePriceRange(range)}
            label={range.label}
          />
        ))}
      </FilterGroup>

      <hr className={styles.divider} />

      {/* 3. RATING Group (single-select minimum, default closed) */}
      <FilterGroup
        title="RATING"
        selectedLabels={selectedRatingLabels}
        defaultOpen={false}
        onReset={resetRating}
      >
        {RATING_OPTIONS.map((opt) => (
          <Checkbox
            key={opt.id}
            id={`${prefix}-rating-${opt.id}`}
            name="rating"
            value={String(opt.minRating)}
            checked={query.minRating === opt.minRating}
            onChange={() => toggleRating(opt.minRating)}
            label={opt.label}
          />
        ))}
      </FilterGroup>
    </aside>
  );
}
