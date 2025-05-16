import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getProducts,
  getProductById,
  getRelatedProducts,
  ProductQueryOptions
} from '../services/productService';
import { Product } from '../data/products';

// Keys for React Query
const QUERY_KEYS = {
  ALL_PRODUCTS: 'products',
  PRODUCT: 'product',
  RELATED_PRODUCTS: 'relatedProducts',
};

/**
 * Hook to fetch products with filtering and pagination
 */
export const useProducts = (options: ProductQueryOptions = {}) => {
  const queryClient = useQueryClient();

  // Use React Query to fetch and cache products
  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: [QUERY_KEYS.ALL_PRODUCTS, options],
    queryFn: () => getProducts(options),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Function to load more products (pagination)
  const loadMore = async () => {
    if (!data || !data.lastDoc) return;

    const newOptions = {
      ...options,
      startAfter: data.lastDoc,
    };

    const newData = await getProducts(newOptions);

    // Update the cache with the combined results
    queryClient.setQueryData([QUERY_KEYS.ALL_PRODUCTS, options], {
      products: [...(data.products || []), ...(newData.products || [])],
      lastDoc: newData.lastDoc,
    });
  };

  return {
    products: data?.products || [],
    lastDoc: data?.lastDoc,
    isLoading,
    error,
    refetch,
    loadMore,
    hasMore: !!data?.lastDoc,
  };
};

/**
 * Hook to fetch a single product by ID
 */
export const useProduct = (id: string) => {
  const {
    data: product,
    isLoading,
    error
  } = useQuery({
    queryKey: [QUERY_KEYS.PRODUCT, id],
    queryFn: () => {
      console.log('Fetching product with ID:', id);
      return getProductById(id);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!id, // Only run the query if we have an ID
    retry: 1, // Only retry once
  });

  console.log('Product from useProduct hook:', product);
  console.log('Error from useProduct hook:', error);

  return {
    product,
    isLoading,
    error,
  };
};

/**
 * Hook to fetch related products for a product
 */
export const useRelatedProducts = (productId: string) => {
  const {
    data: relatedProducts,
    isLoading,
    error
  } = useQuery({
    queryKey: [QUERY_KEYS.RELATED_PRODUCTS, productId],
    queryFn: () => getRelatedProducts(productId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!productId, // Only run the query if we have a product ID
  });

  return {
    relatedProducts: relatedProducts || [],
    isLoading,
    error,
  };
};

/**
 * Hook for searching products (client-side filtering)
 */
export const useProductSearch = (searchTerm: string) => {
  const [results, setResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Get all products
  const { products, isLoading } = useProducts();

  // Filter products based on search term
  useEffect(() => {
    if (!searchTerm.trim() || isLoading) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    const filtered = products.filter(product => {
      const searchLower = searchTerm.toLowerCase();

      // Search in name, description, and type
      return (
        product.name.toLowerCase().includes(searchLower) ||
        (product.description && product.description.toLowerCase().includes(searchLower)) ||
        (product.type && product.type.toLowerCase().includes(searchLower)) ||
        (product.flowerType && product.flowerType.toLowerCase().includes(searchLower))
      );
    });

    setResults(filtered);
    setIsSearching(false);
  }, [searchTerm, products, isLoading]);

  return {
    results,
    isSearching: isLoading || isSearching,
  };
};
