import React from 'react';
import Link from 'next/link';
import { PlpQuery } from '@/types/plp';
import { buildPlpHref, getPaginationItems } from '@/lib/url';
import styles from './Pagination.module.css';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  query: PlpQuery;
}

/**
 * Server component rendering crawlable numbered pagination with accessible
 * rel="prev"/rel="next" links and screen-reader announcements.
 * Renders nothing when totalPages <= 1.
 */
export function Pagination({
  currentPage,
  totalPages,
  query,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const safeCurrent = Math.max(1, Math.min(currentPage, totalPages));
  const items = getPaginationItems(safeCurrent, totalPages);

  const hasPrev = safeCurrent > 1;
  const hasNext = safeCurrent < totalPages;

  return (
    <nav aria-label="Pagination" className={styles.paginationNav}>
      <div className="visually-hidden">
        {`Page ${safeCurrent} of ${totalPages}`}
      </div>

      <ul className={styles.paginationList}>
        {/* Previous page link / disabled span */}
        <li className={styles.item}>
          {hasPrev ? (
            <Link
              href={buildPlpHref(query, { page: safeCurrent - 1 })}
              rel="prev"
              className={styles.link}
              aria-label="Previous page"
            >
              PREV
            </Link>
          ) : (
            <span
              className={styles.disabled}
              aria-disabled="true"
              aria-label="Previous page (disabled)"
            >
              PREV
            </span>
          )}
        </li>

        {/* Page numbers and ellipses */}
        {items.map((item, index) => {
          if (item.type === 'ellipsis') {
            return (
              <li key={`ellipsis-${index}`} className={styles.item}>
                <span className={styles.ellipsis} aria-hidden="true">
                  &hellip;
                </span>
              </li>
            );
          }

          const isCurrent = item.page === safeCurrent;

          return (
            <li key={`page-${item.page}`} className={styles.item}>
              {isCurrent ? (
                <span
                  className={styles.current}
                  aria-current="page"
                  aria-label={`Page ${item.page}, current page`}
                >
                  {item.page}
                </span>
              ) : (
                <Link
                  href={buildPlpHref(query, { page: item.page })}
                  className={styles.link}
                  aria-label={`Page ${item.page}`}
                >
                  {item.page}
                </Link>
              )}
            </li>
          );
        })}

        {/* Next page link / disabled span */}
        <li className={styles.item}>
          {hasNext ? (
            <Link
              href={buildPlpHref(query, { page: safeCurrent + 1 })}
              rel="next"
              className={styles.link}
              aria-label="Next page"
            >
              NEXT
            </Link>
          ) : (
            <span
              className={styles.disabled}
              aria-disabled="true"
              aria-label="Next page (disabled)"
            >
              NEXT
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}
