import React from 'react';
import { Hero, ProductGrid, Toolbar, PlpShell, FilterSidebar } from '@/components/plp';
import { getProducts, getCategories } from '@/lib/api';
import { parsePlpSearchParams } from '@/lib/url';
import styles from './ProductsPage.module.css';

interface ProductsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const rawParams = await searchParams;
  const query = parsePlpSearchParams(rawParams);

  const [paginatedProducts, categories] = await Promise.all([
    getProducts(query),
    getCategories(),
  ]);

  return (
    <div className="container">
      <Hero />
      <div className={styles.plpContainer}>
        <PlpShell
          toolbar={
            <Toolbar
              total={paginatedProducts.meta.total}
              currentSort={query.sort}
            />
          }
          sidebar={<FilterSidebar categories={categories} />}
        >
          <ProductGrid
            products={paginatedProducts.data}
            page={query.page}
          />
        </PlpShell>
      </div>
    </div>
  );
}
