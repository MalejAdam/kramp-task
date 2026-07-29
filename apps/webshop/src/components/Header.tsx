import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useCartContext } from '../pages/_app';
import { SearchDialog, LISTBOX_ID, optionId } from './SearchDialog';
import { CartIcon } from './cartIcon';
import { useDebounce } from '../hooks/useDebounce';
import { fetchGraphQL } from '../utils/fetchGraphQL';
import { SEARCH_PRODUCTS_QUERY } from '../utils/queries';
import { Product } from '../types';
import styles from './Header.module.css';

const MAX_SUGGESTIONS = 5;

export function Header() {
  const router = useRouter();
  const cart = useCartContext();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query.trim(), 300);

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    const controller = new AbortController();
    setIsSearching(true);

    fetchGraphQL<{ searchProducts: Product[] }>(
      SEARCH_PRODUCTS_QUERY,
      { q: debouncedQuery },
      { signal: controller.signal }
    )
      .then(data => {
        if (controller.signal.aborted) return;
        setResults(data.searchProducts.slice(0, MAX_SUGGESTIONS));
        setActiveIndex(-1);
        setIsOpen(true);
      })
      .catch(error => {
        if (error.name !== 'AbortError') setResults([]);
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsSearching(false);
      });

    return () => controller.abort();
  }, [debouncedQuery]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const goToProduct = (id: string) => {
    router.push(`/product/${id}`);
    setIsOpen(false);
    setQuery('');
    setActiveIndex(-1);
  };

  const suggestionsOpen = isOpen && results.length > 0;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (results.length) {
        setIsOpen(true);
        setActiveIndex(i => Math.min(i + 1, results.length - 1));
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      if (suggestionsOpen && activeIndex >= 0) {
        goToProduct(results[activeIndex].id);
      } else if (query.trim()) {
        router.push('/search?q=' + encodeURIComponent(query.trim()));
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  const isActivePage = (path: string) =>
    path === '/' ? router.pathname === '/' : router.pathname.startsWith(path);

  const activeDescendant =
    suggestionsOpen && activeIndex >= 0 ? optionId(results[activeIndex].id) : undefined;

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          Kramp
        </Link>

        <nav className={styles.nav}>
          <Link href="/" className={isActivePage('/') ? styles.activeLink : styles.navLink}>
            Home
          </Link>
          <Link href="/search" className={isActivePage('/search') ? styles.activeLink : styles.navLink}>
            Products
          </Link>
          <Link href="/checkout" className={isActivePage('/checkout') ? styles.activeLink : styles.navLink}>
            Checkout
          </Link>
        </nav>

        <div className={styles.searchWrapper} ref={wrapperRef}>
          <input
            type="search"
            value={query}
            placeholder="Search products..."
            aria-label="Search products"
            role="combobox"
            aria-expanded={suggestionsOpen}
            aria-controls={LISTBOX_ID}
            aria-autocomplete="list"
            aria-activedescendant={activeDescendant}
            className={styles.searchInput}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => results.length && setIsOpen(true)}
          />
          {suggestionsOpen && (
            <SearchDialog
              results={results}
              activeId={activeIndex >= 0 ? results[activeIndex].id : null}
              onSelect={goToProduct}
            />
          )}
          {isSearching && <span className={styles.searchHint}>Searching…</span>}
        </div>

        <CartIcon count={cart.totalItems} />
      </div>
    </header>
  );
}
