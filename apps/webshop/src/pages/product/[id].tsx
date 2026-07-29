import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useCartContext } from '../_app';
import { useProduct } from '../../hooks/useProduct';
import { formatPrice } from '../../utils/formatPrice';
import { Skeleton } from '../../components/Skeleton';
import skeletonStyles from '../../components/Skeleton.module.css';
import styles from './[id].module.css';

export default function ProductPage() {
  const router = useRouter();
  const id = typeof router.query.id === 'string' ? router.query.id : undefined;
  const cart = useCartContext();
  const { product, status } = useProduct(id);

  if (status === 'loading') {
    return (
      <div className={styles.page}>
        <div className={styles.inner}>
          <div className={styles.imageWrapper}>
            <Skeleton className={skeletonStyles.detailImage} />
          </div>
          <div className={styles.details}>
            <Skeleton style={{ height: 12, width: 80 }} />
            <Skeleton style={{ height: 28, width: '70%' }} />
            <Skeleton style={{ height: 24, width: 100 }} />
            <Skeleton style={{ height: 60, width: '100%' }} />
            <Skeleton style={{ height: 48, width: 180 }} />
          </div>
        </div>
      </div>
    );
  }

  if (status === 'notfound') {
    return (
      <div className={styles.page}>
        <div className={styles.stateMessage}>
          <h1>Product not found</h1>
          <p>The product you are looking for does not exist or is no longer available.</p>
          <Link href="/search">Browse all products</Link>
        </div>
      </div>
    );
  }

  if (status === 'error' || !product) {
    return (
      <div className={styles.page}>
        <div className={styles.stateMessage}>
          <h1>Something went wrong</h1>
          <p>We couldn&apos;t load this product. Please try again.</p>
          <button type="button" className={styles.retryButton} onClick={() => router.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    cart.addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
  };

  return (
    <div className={styles.page}>
      <Head>
        <title>{product.name} — Kramp Webshop</title>
      </Head>
      <div className={styles.inner}>
        <div className={styles.imageWrapper}>
          <img src={product.imageUrl} alt={product.name} className={styles.image} />
        </div>
        <div className={styles.details}>
          <p className={styles.category}>{product.category}</p>
          <h1 className={styles.name}>{product.name}</h1>
          <p className={styles.price}>{formatPrice(product.price)}</p>
          <p className={styles.description}>{product.description}</p>
          <p className={styles.meta}>
            Listed: {new Date(product.createdAt).toLocaleDateString('en-GB', { timeZone: 'UTC' })}
            {' · '}
            {product.stock} in stock
          </p>
          <button type="button" className={styles.addToCart} onClick={handleAddToCart}>
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}
