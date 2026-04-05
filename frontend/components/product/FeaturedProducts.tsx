'use client';

import { useState, useEffect } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from './ProductCard';
import { Button } from '@/components/ui/Button';


export function FeaturedProducts() {
  const { products, loading, error } = useProducts({ 
    featured: true, 
    limit: 50 
  });
  const [visibleCount, setVisibleCount] = useState(7);
    const visibleProducts = products?.slice(0, visibleCount);

  const loadMore = () => {
    setVisibleCount((prev) => prev + 8);
  };

  if (loading) {
    return (
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-64"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-600">
            <p>Failed to load featured products. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {visibleProducts?.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
        {visibleCount < products?.length && (
          <div className="text-center mt-12">
          <Button variant="outline" size="lg" onClick={loadMore}>
              Load More
            </Button>
        </div>
      )}
      </div>
    </div>
  );
}
