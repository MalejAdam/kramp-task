import { useEffect, useState } from 'react';
import { fetchGraphQL } from '../utils/fetchGraphQL';
import { PRODUCT_QUERY } from '../utils/queries';
import { Product } from '../types';

type ProductStatus = 'loading' | 'success' | 'notfound' | 'error';

interface UseProductResult {
  product: Product | null;
  status: ProductStatus;
}

export function useProduct(id: string | undefined): UseProductResult {
  const [product, setProduct] = useState<Product | null>(null);
  const [status, setStatus] = useState<ProductStatus>('loading');

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();
    setStatus('loading');
    setProduct(null);

    fetchGraphQL<{ product: Product | null }>(PRODUCT_QUERY, { id }, { signal: controller.signal })
      .then(data => {
        if (controller.signal.aborted) return;
        if (data.product) {
          setProduct(data.product);
          setStatus('success');
        } else {
          setStatus('notfound');
        }
      })
      .catch(error => {
        if (error.name !== 'AbortError') setStatus('error');
      });

    return () => controller.abort();
  }, [id]);

  return { product, status };
}
