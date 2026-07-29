import Link from 'next/link';
import styles from './cartIcon.module.css';

interface CartIconProps {
  count: number;
}

export function CartIcon({ count }: CartIconProps) {
  return (
    <Link href="/checkout" className={styles.cartIcon} aria-label={`Cart, ${count} items`}>
      <span className={styles.label}>{count > 0 ? `Cart (${count})` : 'Cart'}</span>
      {count > 0 && <span className={styles.badge}>{count}</span>}
    </Link>
  );
}
