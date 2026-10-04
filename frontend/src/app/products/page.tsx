import type { Metadata } from 'next';
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
import { JsonLd } from '@/components/seo/JsonLd';
import { getProducts, getCategories } from '@/lib/api';
import { parsePlpSearchParams, buildPlpHref } from '@/lib/url';
import { SITE_NAME, absoluteUrl, buildJsonLd } from '@/lib/seo';
import styles from './ProductsPage.module.css';

interface ProductsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function buildSeoTitle(catNames: string[], page: number): string {
  const base =
    catNames.length > 0 ? `Shop ${catNames.join(' & ')}` : 'Shop All Products';
  const pageSuffix = page > 1 ? ` Page ${page}` : '';
  const suffix = ` | ${SITE_NAME}`;
  const maxBaseLen = 60 - suffix.length - pageSuffix.length;
  const safeBase =
    base.length > maxBaseLen ? `${base.slice(0, maxBaseLen - 3)}...` : base;
  return `${safeBase}${pageSuffix}${suffix}`;
}

function buildSeoDescription(total: number, catNames: string[]): string {
  if (catNames.length === 0) {
    return `Discover ${total} curated sustainable artisan products at ${SITE_NAME}. Shop fashion, jewelry, and handcrafted accessories with premium materials and ethical design.`;
  }
  const cats = catNames.join(' & ');
  const prefix = `Shop ${total} curated ${cats} items at ${SITE_NAME}. Discover ethical materials, handcrafted quality, and timeless artisan designs created for you.`;
  if (prefix.length > 160) {
    return `${prefix.slice(0, 157)}...`;
  }
  if (prefix.length < 140) {
    return `${prefix.slice(0, -1)} every day.`.slice(0, 160);
  }
  return prefix;
}

export async function generateMetadata({
  searchParams,
}: ProductsPageProps): Promise<Metadata> {
  const rawParams = await searchParams;
  const query = parsePlpSearchParams(rawParams);

  // Reuses the React cache()-deduped API calls
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

  const selectedCategoryNames = (query.category || [])
    .map((slug) => categories.find((c) => c.slug === slug)?.name)
    .filter((name): name is string => Boolean(name));

  const title = buildSeoTitle(selectedCategoryNames, query.page);
  const description = buildSeoDescription(
    paginatedProducts.meta.total,
    selectedCategoryNames
  );

  const canonicalPath = buildPlpHref(query, {});
  const canonicalUrl = absoluteUrl(canonicalPath);

  const isNoindex = Boolean(query.q) || paginatedProducts.meta.total === 0;

  const firstImage = paginatedProducts.data[0]?.images?.[0];
  const ogImageUrl = firstImage?.url
    ? absoluteUrl(firstImage.url)
    : absoluteUrl('/icon.svg');

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: !isNoindex,
      follow: true,
    },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title,
      description,
      url: canonicalUrl,
      images: [
        {
          url: ogImageUrl,
          width: 300,
          height: 399,
          alt: firstImage?.alt || title,
        },
      ],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  };
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
  const canonicalPath = buildPlpHref(query, {});
  const canonicalUrl = absoluteUrl(canonicalPath);

  const jsonLdData = buildJsonLd({
    products: paginatedProducts.data,
    query,
    categories,
    canonicalUrl,
  });

  return (
    <>
      <JsonLd data={jsonLdData} />
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
