import Image from 'next/image';
import styles from './ProductCard.module.css';
import { Product } from '@/types/product';
import { formatPrice } from '@/lib/format';
import { WishlistButton } from './WishlistButton';

export interface ProductCardProps {
  product: Product;
  index: number;
  page?: number;
}

export function ProductCard({ product, index, page = 1 }: ProductCardProps) {
  const isPriority = page === 1 && index < 4;
  const image = product.images?.[0] || {
    url: `/products/${product.slug}.jpg`,
    alt: `${product.title} product photo`,
    position: 0,
  };

  return (
    <li className={styles.productCard}>
      <article id={`product-${product.slug}`} className={styles.productArticle}>
        <div className={styles.productMedia}>
          <Image
            src={image.url}
            alt={image.alt}
            width={300}
            height={399}
            sizes="(max-width: 767px) 50vw, (max-width: 1199px) 33vw, 300px"
            priority={isPriority}
            loading={isPriority ? undefined : 'lazy'}
            decoding={isPriority ? 'sync' : 'async'}
            quality={75}
            className={styles.productImage}
          />
        </div>

        <div className={styles.productBody}>
          <h3 className={styles.productTitle}>{product.title}</h3>
          <WishlistButton
            productId={product.id}
            title={product.title}
            className={styles.productWish}
            iconClassName={styles.productWishIcon}
          />
          <p className={styles.productPrice}>{formatPrice(product.price)}</p>
          <p className={styles.productNote}>
            <span className={styles.productNoteHighlight}>Sign in</span> or Create an
            account to see pricing
          </p>
        </div>
      </article>
    </li>
  );
}
