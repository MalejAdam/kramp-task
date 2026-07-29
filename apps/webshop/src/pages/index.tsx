import { GetStaticProps } from 'next';
import Link from 'next/link';
import ProductCard from '../components/ProductCard';
import { fetchGraphQL } from '../utils/fetchGraphQL';
import { PRODUCT_QUERY } from '../utils/queries';
import { Product, ProductCategory } from '../types';
import styles from './index.module.css';

const FEATURED_IDS = ['1', '4', '11', '17'];
const CATEGORIES: ProductCategory[] = ['Tools', 'Fasteners', 'Safety Equipment', 'Power Tools'];

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  const results = await Promise.all(
    FEATURED_IDS.map(id =>
      fetchGraphQL<{ product: Product | null }>(PRODUCT_QUERY, { id })
        .then(data => data.product)
        .catch(error => {
          console.error(`Failed to load featured product ${id}:`, error);
          return null;
        })
    )
  );

  const featured = results.filter((product): product is Product => product !== null);

  return {
    props: { featured, generatedAt: new Date().toISOString() },
    revalidate: 60,
  };
};

interface HomePageProps {
  featured: Product[];
  generatedAt: string;
}

const updatedAtFormatter = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'UTC',
});

export default function HomePage({ featured, generatedAt }: HomePageProps) {
  return (
    <div>
      <section className={styles.hero}>
        <p className={styles.heroBrand}>Kramp Webshop</p>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Industrial supplies, delivered.</h1>
          <p className={styles.heroSubtitle}>
            Tools, fasteners, safety equipment and power tools for professionals.
          </p>
        </div>
      </section>

      <section className={styles.featured}>
        <div className={styles.featuredHeader}>
          <h2>Featured products</h2>
          <p className={styles.timestamp}>
            Last updated: {updatedAtFormatter.format(new Date(generatedAt))} UTC
          </p>
        </div>
        <div className={styles.grid}>
          {featured.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className={styles.categories}>
        <h2>Shop by category</h2>
        <div className={styles.categoryGrid}>
          {CATEGORIES.map(cat => (
            <Link
              key={cat}
              href={`/search?q=${encodeURIComponent(cat)}`}
              className={styles.categoryCard}
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
