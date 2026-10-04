import styles from './ProductGrid.module.css';
import { Product } from '@/types/product';
import { ProductCard } from './ProductCard';

export interface ProductGridProps {
  products: Product[];
  page?: number;
  filtersHidden?: boolean;
}

export function ProductGrid({
  products,
  page = 1,
  filtersHidden = false,
}: ProductGridProps) {
  return (
    <section className={styles.productResults} aria-labelledby="products-heading">
      <h2 id="products-heading" className="visually-hidden">
        Products
      </h2>
      <ul
        className={`${styles.productGrid} ${filtersHidden ? styles.filtersHidden : ''}`}
      >
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            index={index}
            page={page}
          />
        ))}
      </ul>
    </section>
  );
}
