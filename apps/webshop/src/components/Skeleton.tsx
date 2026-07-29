import { CSSProperties } from 'react';
import cardStyles from './ProductCard.module.css';
import styles from './Skeleton.module.css';

interface SkeletonProps {
  className?: string;
  style?: CSSProperties;
}

export function Skeleton({ className, style }: SkeletonProps) {
  return <div className={`${styles.skeleton} ${className ?? ''}`} style={style} aria-hidden="true" />;
}

export function ProductCardSkeleton() {
  return (
    <div className={cardStyles.card} aria-hidden="true">
      <Skeleton className={styles.cardImage} />
      <div className={cardStyles.body}>
        <Skeleton className={styles.line} style={{ width: '80%' }} />
        <Skeleton className={styles.line} style={{ width: '40%' }} />
        <Skeleton className={styles.button} />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </>
  );
}
