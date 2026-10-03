import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className="container">
      <section className={styles.container} aria-labelledby="not-found-heading">
        <h1 id="not-found-heading" className={styles.title}>
          Page Not Found
        </h1>
        <p className={styles.message}>
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/products" className={styles.button}>
          Return to Products
        </Link>
      </section>
    </div>
  );
}
