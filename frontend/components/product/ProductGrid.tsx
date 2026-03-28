'use client';

import { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import { LoadingCardSkeleton } from '@/components/ui/Loading';
import { Button } from '@/components/ui/Button';
import { Grid, List } from 'lucide-react';
import { Product } from '@/types/product';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  error?: string | null;
  showWishlist?: boolean;
  showQuickView?: boolean;
  viewMode?: 'grid' | 'list';
  className?: string;
}

export function ProductGrid({ 
  products, 
  loading = false, 
  error = null,
  showWishlist = true,
  showQuickView = true,
  viewMode = 'grid',
  className = ''
}: ProductGridProps) {
  const [visibleProducts, setVisibleProducts] = useState(12);

  // Reset visible products when products change
  useEffect(() => {
    setVisibleProducts(12);
  }, [products]);

  const handleLoadMore = () => {
    setVisibleProducts(prev => prev + 12);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <LoadingCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <svg
            className="w-16 h-16 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Unable to load products
        </h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg
            className="w-16 h-16 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No products found
        </h3>
        <p className="text-muted-foreground mb-4">
          Try adjusting your filters or search terms
        </p>
      </div>
    );
  }

  const displayedProducts = products.slice(0, visibleProducts);
  const hasMore = products.length > visibleProducts;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Products Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {displayedProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              showWishlist={showWishlist}
              showQuickView={showQuickView}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {displayedProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              showWishlist={showWishlist}
              showQuickView={showQuickView}
              className="flex flex-row"
            />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center">
          <Button
            onClick={handleLoadMore}
            variant="outline"
            size="lg"
          >
            Load More Products
          </Button>
        </div>
      )}
    </div>
  );
}
