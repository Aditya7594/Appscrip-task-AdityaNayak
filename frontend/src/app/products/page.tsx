import React from 'react';
import { Hero, ProductGrid } from '@/components/plp';
import { getProducts, getCategories } from '@/lib/api';
import { parsePlpSearchParams } from '@/lib/url';
import styles from './ProductsPage.module.css';

interface ProductsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const rawParams = await searchParams;
  const query = parsePlpSearchParams(rawParams);

  const [paginatedProducts] = await Promise.all([
    getProducts(query),
    getCategories(),
  ]);

  return (
    <div className="container">
      <Hero />
      <div className={styles.plpContainer}>
        <div className={styles.plpContent}>
          <aside className={styles.sidebar} aria-label="Filters" />
          <ProductGrid
            products={paginatedProducts.data}
            page={query.page}
          />
        </div>
      </div>
    </div>
  );
}
