import styles from './Hero.module.css';

export function Hero() {
  return (
    <section className={styles.hero}>
      <h1 className={styles.heroTitle}>Discover our products</h1>
      <p className={styles.heroText}>
        Lorem ipsum dolor sit amet consectetur. Amet est posuere rhoncus scelerisque.
        Dolor integer scelerisque nibh amet mi ut elementum dolor.
      </p>
    </section>
  );
}
