import Link from 'next/link';
import { Product } from '../types';
import { formatPrice } from '../utils/formatPrice';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className={styles.card} data-testid="product-card">
      <img
        src={product.imageUrl}
        alt={product.name}
        width="300"
        height="200"
        loading="lazy"
        className={styles.image}
      />
      <div className={styles.body}>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.price} data-testid="product-price">
          {formatPrice(product.price)}
        </p>
        <Link href={`/product/${product.id}`} className={styles.button}>
          View product
        </Link>
      </div>
    </div>
  );
}
