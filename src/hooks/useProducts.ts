import { useQuery } from '@tanstack/react-query';
import { fetchProducts, Product } from '@/lib/api';

export function useProducts() {
  return useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}
