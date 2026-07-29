import { Product } from '../types';
import { formatPrice } from '../utils/formatPrice';
import styles from './SearchDialog.module.css';

export const LISTBOX_ID = 'search-suggestions';
export const optionId = (productId: string) => `search-opt-${productId}`;

interface SearchDialogProps {
  results: Product[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

export function SearchDialog({ results, activeId, onSelect }: SearchDialogProps) {
  if (!results.length) return null;

  return (
    <ul className={styles.dialog} id={LISTBOX_ID} role="listbox">
      {results.map(result => (
        <li key={result.id} role="none">
          <button
            type="button"
            id={optionId(result.id)}
            role="option"
            aria-selected={result.id === activeId}
            className={`${styles.item} ${result.id === activeId ? styles.itemActive : ''}`}
            onMouseDown={e => e.preventDefault()}
            onClick={() => onSelect(result.id)}
          >
            <span className={styles.itemName}>{result.name}</span>
            <span className={styles.itemPrice}>{formatPrice(result.price)}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
