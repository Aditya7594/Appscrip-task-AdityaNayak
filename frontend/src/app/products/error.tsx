'use client';

import React from 'react';
import styles from './error.module.css';

export interface ProductsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Client error boundary for /products.
 * Shows friendly error copy, a "Try again" retry trigger, and optional digest.
 * Never outputs raw server error details.
 */
export default function ProductsError({ error, reset }: ProductsErrorProps) {
  return (
    <div className="container">
      <div role="alert" className={styles.errorContainer}>
        <h2 className={styles.title}>Something went wrong</h2>
        <p className={styles.message}>
          Something went wrong while loading products.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className={styles.retryBtn}
        >
          Try again
        </button>
        {error.digest && (
          <p className={styles.digest}>
            Reference ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
