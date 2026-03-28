'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Product } from '@/types/product';

interface UseProductsOptions {
  featured?: boolean;
  limit?: number;
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: string;
  slug?: string;
}

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = new URLSearchParams();
        if (options.featured) params.append('featured', 'true');
        if (options.limit) params.append('limit', options.limit.toString());
        if (options.category) params.append('category', options.category);
        if (options.search) params.append('search', options.search);
        if (options.minPrice) params.append('minPrice', options.minPrice.toString());
        if (options.maxPrice) params.append('maxPrice', options.maxPrice.toString());
        if (options.minRating) params.append('rating', options.minRating.toString());
        if (options.sortBy) params.append('sort', options.sortBy);

        let apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/products`;
        
        // If fetching by slug, use the slug endpoint
        if (options.slug) {
          apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/products/slug/${options.slug}`;
        } else {
          apiUrl += `?${params.toString()}`;
        }

        const response = await axios.get(apiUrl);

        // Handle both single product and product arrays
        if (options.slug) {
          setProducts(response.data.data?.product ? [response.data.data.product] : []);
        } else {
          setProducts(response.data.data?.products || []);
        }
      } catch (err: any) {
        console.error('API Error:', err.response?.data?.message || err.message);
        setError(err.response?.data?.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [options.featured, options.limit, options.category, options.search, options.minPrice, options.maxPrice, options.minRating, options.sortBy, options.slug]);

  // FIXED: Updated refetch to handle slugs exactly like the initial fetch
  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (options.featured) params.append('featured', 'true');
      if (options.limit) params.append('limit', options.limit.toString());
      if (options.category) params.append('category', options.category);
      if (options.search) params.append('search', options.search);
      if (options.minPrice) params.append('minPrice', options.minPrice.toString());
      if (options.maxPrice) params.append('maxPrice', options.maxPrice.toString());
      if (options.minRating) params.append('rating', options.minRating.toString());
      if (options.sortBy) params.append('sort', options.sortBy);

      let apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/products`;
        
      if (options.slug) {
        apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/products/slug/${options.slug}`;
      } else {
        apiUrl += `?${params.toString()}`;
      }

      const response = await axios.get(apiUrl);

      if (options.slug) {
        setProducts(response.data.data?.product ? [response.data.data.product] : []);
      } else {
        setProducts(response.data.data?.products || []);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, error, refetch };
}