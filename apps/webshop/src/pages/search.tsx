import { useRouter } from 'next/router';
import { groupBy } from '../utils/groupBy';
import { useSearchProducts } from '../hooks/useSearchProducts';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/Skeleton';
import styles from './search.module.css';

export default function SearchPage() {
  const router = useRouter();
  const q = typeof router.query.q === 'string' ? router.query.q : '';
  const { results, status } = useSearchProducts(q, router.isReady);

  const grouped = groupBy(results, 'category');

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.heading}>{q ? `Results for "${q}"` : 'All products'}</h1>

        {status === 'loading' && (
          <div className={styles.grid}>
            <ProductGridSkeleton count={8} />
          </div>
        )}

        {status === 'error' && (
          <p className={styles.empty}>Something went wrong while searching. Please try again.</p>
        )}

        {status === 'success' && !results.length && (
          <p className={styles.empty}>No products found.</p>
        )}

        {status === 'success' &&
          Object.keys(grouped).map(category => (
            <section key={category} className={styles.category}>
              <h2 className={styles.categoryTitle}>{category}</h2>
              <div className={styles.grid}>
                {grouped[category].map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          ))}
      </div>
    </div>
  );
}
