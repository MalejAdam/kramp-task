import { useEffect, useState } from 'react';
import { fetchGraphQL } from '../utils/fetchGraphQL';
import { SEARCH_PRODUCTS_QUERY } from '../utils/queries';
import { Product } from '../types';

type SearchStatus = 'loading' | 'success' | 'error';

interface UseSearchProductsResult {
  results: Product[];
  status: SearchStatus;
}

export function useSearchProducts(query: string, enabled = true): UseSearchProductsResult {
  const [results, setResults] = useState<Product[]>([]);
  const [status, setStatus] = useState<SearchStatus>('loading');

  useEffect(() => {
    if (!enabled) return;

    const controller = new AbortController();
    setStatus('loading');

    fetchGraphQL<{ searchProducts: Product[] }>(
      SEARCH_PRODUCTS_QUERY,
      { q: query },
      { signal: controller.signal }
    )
      .then(data => {
        if (controller.signal.aborted) return;
        setResults(data.searchProducts);
        setStatus('success');
      })
      .catch(error => {
        if (error.name !== 'AbortError') setStatus('error');
      });

    return () => controller.abort();
  }, [query, enabled]);

  return { results, status };
}
