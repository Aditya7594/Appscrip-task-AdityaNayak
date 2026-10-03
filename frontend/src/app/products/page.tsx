import { redirect } from 'next/navigation';
import {
  Breadcrumb,
  Hero,
  ProductGrid,
  Toolbar,
  PlpShell,
  FilterSidebar,
  Pagination,
  EmptyState,
} from '@/components/plp';
import { getProducts, getCategories } from '@/lib/api';
import { parsePlpSearchParams, buildPlpHref } from '@/lib/url';
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

  // If page exceeds totalPages and total > 0, redirect to the last valid page
  if (
    paginatedProducts.meta.total > 0 &&
    query.page > paginatedProducts.meta.totalPages
  ) {
    redirect(buildPlpHref(query, { page: paginatedProducts.meta.totalPages }));
  }

  const isEmpty = paginatedProducts.meta.total === 0;

  return (
    <>
      <Breadcrumb />
      <div className="container">
        <Hero />
        <div className={styles.plpContainer}>
          <PlpShell
            toolbar={
              <Toolbar
                total={paginatedProducts.meta.total}
                currentSort={query.sort}
                categories={categories}
              />
            }
            sidebar={<FilterSidebar categories={categories} />}
          >
          {isEmpty ? (
            <EmptyState />
          ) : (
            <>
              <ProductGrid
                products={paginatedProducts.data}
                page={query.page}
              />
              <Pagination
                currentPage={paginatedProducts.meta.page}
                totalPages={paginatedProducts.meta.totalPages}
                query={query}
              />
            </>
          )}
        </PlpShell>
      </div>
    </div>
    </>
  );
}
