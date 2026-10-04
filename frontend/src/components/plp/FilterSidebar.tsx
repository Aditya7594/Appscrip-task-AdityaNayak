'use client';

import React, { useCallback, useMemo, useState } from 'react';
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

// Facet definitions matching the Figma design specification exactly
interface FacetGroupDef {
  key: string;
  title: string;
  defaultOpen?: boolean;
  options: { label: string; value: string; categorySlug?: string }[];
}

const FIGMA_FACET_GROUPS: FacetGroupDef[] = [
  {
    key: 'ideal-for',
    title: 'IDEAL FOR',
    defaultOpen: true,
    options: [
      { label: 'All', value: 'all' },
      { label: 'Men', value: 'men', categorySlug: 'mens-clothing' },
      { label: 'Women', value: 'women', categorySlug: 'womens-clothing' },
      { label: 'Baby & Kids', value: 'baby-kids' },
    ],
  },
  {
    key: 'occasion',
    title: 'OCCASION',
    options: [
      { label: 'All', value: 'all' },
      { label: 'Casual', value: 'casual' },
      { label: 'Formal', value: 'formal' },
      { label: 'Party', value: 'party' },
      { label: 'Work', value: 'work' },
      { label: 'Evening', value: 'evening' },
      { label: 'Festival', value: 'festival' },
    ],
  },
  {
    key: 'work',
    title: 'WORK',
    options: [
      { label: 'All', value: 'all' },
      { label: 'Office', value: 'office' },
      { label: 'Daily', value: 'daily' },
      { label: 'Outdoor', value: 'outdoor' },
      { label: 'Studio', value: 'studio' },
    ],
  },
  {
    key: 'fabric',
    title: 'FABRIC',
    options: [
      { label: 'All', value: 'all' },
      { label: 'Cotton', value: 'cotton' },
      { label: 'Silk', value: 'silk' },
      { label: 'Linen', value: 'linen' },
      { label: 'Leather', value: 'leather' },
      { label: 'Denim', value: 'denim' },
      { label: 'Wool', value: 'wool' },
    ],
  },
  {
    key: 'segment',
    title: 'SEGMENT',
    options: [
      { label: 'All', value: 'all' },
      { label: 'Jewelry', value: 'jewelry', categorySlug: 'jewelery' },
      { label: 'Electronics', value: 'electronics', categorySlug: 'electronics' },
      { label: 'Silver', value: 'silver' },
      { label: 'Gold', value: 'gold' },
      { label: 'Luxury', value: 'luxury' },
    ],
  },
  {
    key: 'suitable-for',
    title: 'SUITABLE FOR',
    options: [
      { label: 'All', value: 'all' },
      { label: 'All Seasons', value: 'all-seasons' },
      { label: 'Summer', value: 'summer' },
      { label: 'Winter', value: 'winter' },
    ],
  },
  {
    key: 'raw-materials',
    title: 'RAW MATERIALS',
    options: [
      { label: 'All', value: 'all' },
      { label: 'Organic Cotton', value: 'organic-cotton' },
      { label: 'Solid Brass', value: 'solid-brass' },
      { label: 'Sterling Silver', value: 'sterling-silver' },
      { label: 'Recycled Poly', value: 'recycled-poly' },
    ],
  },
  {
    key: 'pattern',
    title: 'PATTERN',
    options: [
      { label: 'All', value: 'all' },
      { label: 'Solid', value: 'solid' },
      { label: 'Striped', value: 'striped' },
      { label: 'Printed', value: 'printed' },
      { label: 'Textured', value: 'textured' },
      { label: 'Geometric', value: 'geometric' },
    ],
  },
];

export function FilterSidebar({ categories, id = 'filters' }: FilterSidebarProps) {
  const { query, navigate } = usePlpNavigation();
  const isDesktop = id === 'filters';
  const prefix = isDesktop ? 'filter' : `${id}-filter`;

  // Top Customizable toggle
  const [isCustomizable, setIsCustomizable] = useState(false);

  // Facet selections for interactive UI
  const [facetSelections, setFacetSelections] = useState<Record<string, string[]>>({});

  // Active Category Slugs from URL
  const selectedCategorySlugs = useMemo(() => {
    return query.category || [];
  }, [query.category]);

  const toggleCategorySlug = useCallback(
    (slug: string) => {
      const isSelected = selectedCategorySlugs.includes(slug);
      const nextCategories = isSelected
        ? selectedCategorySlugs.filter((s) => s !== slug)
        : [...selectedCategorySlugs, slug];
      navigate({ category: nextCategories, page: 1 });
    },
    [selectedCategorySlugs, navigate],
  );

  const resetCategories = useCallback(() => {
    navigate({ category: undefined, page: 1 });
  }, [navigate]);

  const selectedCategoryLabels = useMemo(() => {
    return categories
      .filter((c) => selectedCategorySlugs.includes(c.slug))
      .map((c) => c.name);
  }, [categories, selectedCategorySlugs]);

  // Facet selection handlers
  const toggleFacet = useCallback(
    (groupKey: string, optionValue: string, categorySlug?: string) => {
      // If option is 'all', clear selections for this group
      if (optionValue === 'all') {
        setFacetSelections((prev) => {
          const next = { ...prev };
          delete next[groupKey];
          return next;
        });
        if (categorySlug) {
          toggleCategorySlug(categorySlug);
        }
        return;
      }

      setFacetSelections((prev) => {
        const current = prev[groupKey] || [];
        const isSelected = current.includes(optionValue);
        const updated = isSelected
          ? current.filter((v) => v !== optionValue)
          : [...current, optionValue];

        return {
          ...prev,
          [groupKey]: updated,
        };
      });

      // If tied to a database category slug, toggle in URL query
      if (categorySlug) {
        toggleCategorySlug(categorySlug);
      }
    },
    [toggleCategorySlug],
  );

  const resetFacetGroup = useCallback(
    (groupKey: string, options: { categorySlug?: string }[]) => {
      setFacetSelections((prev) => {
        const next = { ...prev };
        delete next[groupKey];
        return next;
      });

      // Clear any categories associated with this group
      const relatedSlugs = options
        .map((opt) => opt.categorySlug)
        .filter((slug): slug is string => Boolean(slug));

      if (relatedSlugs.length > 0) {
        const nextCategories = selectedCategorySlugs.filter((s) => !relatedSlugs.includes(s));
        navigate({ category: nextCategories, page: 1 });
      }
    },
    [selectedCategorySlugs, navigate],
  );

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
        navigate({ minPrice: undefined, maxPrice: undefined, page: 1 });
      } else {
        navigate({ minPrice: range.min, maxPrice: range.max, page: 1 });
      }
    },
    [matchedPriceRange, navigate],
  );

  const resetPrice = useCallback(() => {
    navigate({ minPrice: undefined, maxPrice: undefined, page: 1 });
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
        navigate({ minRating: undefined, page: 1 });
      } else {
        navigate({ minRating, page: 1 });
      }
    },
    [query.minRating, navigate],
  );

  const resetRating = useCallback(() => {
    navigate({ minRating: undefined, page: 1 });
  }, [navigate]);

  return (
    <aside id={id} className={styles.filters} aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="visually-hidden">
        Filters
      </h2>

      {/* Top Row: CUSTOMIZABLE Checkbox (22x22px, 18px Bold uppercase) */}
      <div className={styles.customizableRow}>
        <Checkbox
          id={`${prefix}-customizable`}
          name="customizable"
          value="customizable"
          checked={isCustomizable}
          onChange={setIsCustomizable}
          label="CUSTOMIZABLE"
          size="large"
        />
      </div>

      <hr className={styles.divider} />

      {/* Category Facet Group */}
      {categories.length > 0 && (
        <>
          <FilterGroup
            title="CATEGORY"
            selectedLabels={selectedCategoryLabels}
            defaultOpen={true}
            onReset={resetCategories}
          >
            {categories.map((cat) => (
              <Checkbox
                key={cat.slug}
                id={`${prefix}-cat-${cat.slug}`}
                name="category[]"
                value={cat.slug}
                checked={selectedCategorySlugs.includes(cat.slug)}
                onChange={() => toggleCategorySlug(cat.slug)}
                label={cat.name}
                count={cat.productCount}
              />
            ))}
          </FilterGroup>
          <hr className={styles.divider} />
        </>
      )}

      {/* Figma Facet Groups */}
      {FIGMA_FACET_GROUPS.map((group) => {
        const currentSelections = facetSelections[group.key] || [];

        // Check which labels to show in summary
        const selectedLabels = group.options
          .filter((opt) => {
            if (opt.categorySlug) {
              return selectedCategorySlugs.includes(opt.categorySlug);
            }
            return currentSelections.includes(opt.value);
          })
          .map((opt) => opt.label);

        return (
          <React.Fragment key={group.key}>
            <FilterGroup
              title={group.title}
              selectedLabels={selectedLabels}
              defaultOpen={group.defaultOpen || false}
              onReset={() => resetFacetGroup(group.key, group.options)}
            >
              {group.options.map((opt) => {
                const isChecked = opt.categorySlug
                  ? selectedCategorySlugs.includes(opt.categorySlug)
                  : currentSelections.includes(opt.value);

                // Option count if category exists
                const matchedCategory = opt.categorySlug
                  ? categories.find((c) => c.slug === opt.categorySlug)
                  : undefined;

                return (
                  <Checkbox
                    key={opt.value}
                    id={`${prefix}-${group.key}-${opt.value}`}
                    name={`${group.key}[]`}
                    value={opt.value}
                    checked={isChecked}
                    onChange={() => toggleFacet(group.key, opt.value, opt.categorySlug)}
                    label={opt.label}
                    count={matchedCategory?.productCount}
                  />
                );
              })}
            </FilterGroup>
            <hr className={styles.divider} />
          </React.Fragment>
        );
      })}

      {/* E-Commerce PRICE Facet Group */}
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

      {/* E-Commerce RATING Facet Group */}
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
