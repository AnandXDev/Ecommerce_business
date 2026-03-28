"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductFilters } from '@/components/product/ProductFilters';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingCardSkeleton } from '@/components/ui/Loading';
import { 
  ArrowUpDown, 
  Grid, 
  List, 
  Filter,
  ChevronDown
} from 'lucide-react';

// Mock data - replace with actual API calls
const mockProducts = [
  {
    _id: '1',
    name: 'Wireless Bluetooth Headphones',
    slug: 'wireless-bluetooth-headphones',
    description: 'Premium noise-cancelling wireless headphones with 30-hour battery life.',
    images: [
      { url: '/api/placeholder/300/300', alt: 'Wireless Headphones' },
      { url: '/api/placeholder/300/300', alt: 'Headphones Side View' }
    ],
    pricing: {
      price: 199.99,
      comparePrice: 299.99,
      discountPercentage: 33
    },
    category: {
      name: 'Electronics',
      slug: 'electronics'
    },
    reviews: {
      averageRating: 4.5,
      count: 128
    },
    inventory: {
      quantity: 50,
      lowStockThreshold: 10
    },
    isFeatured: true,
    shipping: {
      freeShipping: true,
      estimatedDelivery: '2-3 business days'
    }
  },
  {
    _id: '2',
    name: 'Smart Watch Pro',
    slug: 'smart-watch-pro',
    description: 'Advanced fitness tracking and health monitoring smartwatch.',
    images: [
      { url: '/api/placeholder/300/300', alt: 'Smart Watch' }
    ],
    pricing: {
      price: 299.99,
      comparePrice: null,
      discountPercentage: null
    },
    category: {
      name: 'Electronics',
      slug: 'electronics'
    },
    reviews: {
      averageRating: 4.8,
      count: 89
    },
    inventory: {
      quantity: 25,
      lowStockThreshold: 10
    },
    isFeatured: true,
    shipping: {
      freeShipping: true,
      estimatedDelivery: '1-2 business days'
    }
  }
];

const mockCategories = [
  { name: 'Electronics', slug: 'electronics', count: 156 },
  { name: 'Fashion', slug: 'fashion', count: 234 },
  { name: 'Home & Garden', slug: 'home-garden', count: 89 },
  { name: 'Sports', slug: 'sports', count: 67 },
  { name: 'Books', slug: 'books', count: 145 }
];

interface FilterState {
  category: string[];
  priceRange: [number, number];
  rating: number;
  inStock: boolean;
  onSale: boolean;
  featured: boolean;
  newArrivals: boolean;
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState(mockProducts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  
  const [filters, setFilters] = useState<FilterState>({
    category: [],
    priceRange: [0, 1000],
    rating: 0,
    inStock: false,
    onSale: false,
    featured: false,
    newArrivals: false
  });

  const priceRange = { min: 0, max: 1000 };

  // Initialize filters from URL params
  useEffect(() => {
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const rating = searchParams.get('rating');
    const inStock = searchParams.get('inStock');
    const onSale = searchParams.get('onSale');
    const featured = searchParams.get('featured');
    const newArrivals = searchParams.get('newArrivals');

    setFilters({
      category: category ? category.split(',') : [],
      priceRange: [
        minPrice ? parseInt(minPrice) : priceRange.min,
        maxPrice ? parseInt(maxPrice) : priceRange.max
      ],
      rating: rating ? parseInt(rating) : 0,
      inStock: inStock === 'true',
      onSale: onSale === 'true',
      featured: featured === 'true',
      newArrivals: newArrivals === 'true'
    });
  }, [searchParams]);

  // Fetch products based on filters
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Mock API call - replace with actual API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Filter products based on current filters
        let filteredProducts = [...mockProducts];
        
        // Apply category filter
        if (filters.category.length > 0) {
          filteredProducts = filteredProducts.filter(product =>
            filters.category.includes(product.category.slug)
          );
        }
        
        // Apply price filter
        filteredProducts = filteredProducts.filter(product =>
          product.pricing.price >= filters.priceRange[0] &&
          product.pricing.price <= filters.priceRange[1]
        );
        
        // Apply rating filter
        if (filters.rating > 0) {
          filteredProducts = filteredProducts.filter(product =>
            product.reviews.averageRating >= filters.rating
          );
        }
        
        // Apply stock filter
        if (filters.inStock) {
          filteredProducts = filteredProducts.filter(product =>
            product.inventory.quantity > 0
          );
        }
        
        // Apply sale filter
        if (filters.onSale) {
          filteredProducts = filteredProducts.filter(product =>
            product.pricing.comparePrice && product.pricing.comparePrice > product.pricing.price
          );
        }
        
        // Apply featured filter
        if (filters.featured) {
          filteredProducts = filteredProducts.filter(product =>
            product.isFeatured
          );
        }
        
        // Apply sorting
        filteredProducts.sort((a, b) => {
          let comparison = 0;
          
          switch (sortBy) {
            case 'price':
              comparison = a.pricing.price - b.pricing.price;
              break;
            case 'name':
              comparison = a.name.localeCompare(b.name);
              break;
            case 'rating':
              comparison = a.reviews.averageRating - b.reviews.averageRating;
              break;
            case 'createdAt':
              // Mock creation time
              comparison = 0;
              break;
            default:
              comparison = 0;
          }
          
          return sortOrder === 'asc' ? comparison : -comparison;
        });
        
        setProducts(filteredProducts);
      } catch (err) {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters, sortBy, sortOrder]);

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleSortChange = (sort: string, order: 'asc' | 'desc') => {
    setSortBy(sort);
    setSortOrder(order);
    setShowSortDropdown(false);
  };

  const sortOptions = [
    { label: 'Newest', value: 'createdAt', order: 'desc' as const },
    { label: 'Oldest', value: 'createdAt', order: 'asc' as const },
    { label: 'Price: Low to High', value: 'price', order: 'asc' as const },
    { label: 'Price: High to Low', value: 'price', order: 'desc' as const },
    { label: 'Name: A-Z', value: 'name', order: 'asc' as const },
    { label: 'Name: Z-A', value: 'name', order: 'desc' as const },
    { label: 'Rating: High to Low', value: 'rating', order: 'desc' as const },
    { label: 'Rating: Low to High', value: 'rating', order: 'asc' as const }
  ];

  const activeFilterCount = [
    filters.category.length,
    filters.priceRange[0] > priceRange.min ? 1 : 0,
    filters.priceRange[1] < priceRange.max ? 1 : 0,
    filters.rating > 0 ? 1 : 0,
    filters.inStock ? 1 : 0,
    filters.onSale ? 1 : 0,
    filters.featured ? 1 : 0,
    filters.newArrivals ? 1 : 0
  ].reduce((sum, count) => sum + count, 0);

  return (
    <div className="container-custom py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Products</h1>
        <p className="text-muted-foreground">
          Discover our complete collection of premium products
        </p>
      </div>

      {/* Filters and Sort Bar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center space-x-2"
            >
              <ArrowUpDown className="h-4 w-4" />
              <span>Sort: {sortOptions.find(opt => opt.value === sortBy && opt.order === sortOrder)?.label}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
            
            {showSortDropdown && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-background border rounded-lg shadow-lg z-10">
                {sortOptions.map((option) => (
                  <button
                    key={`${option.value}-${option.order}`}
                    onClick={() => handleSortChange(option.value, option.order)}
                    className={`w-full text-left px-4 py-2 hover:bg-accent transition-colors ${
                      sortBy === option.value && sortOrder === option.order ? 'bg-accent' : ''
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 lg:text-right">
          <p className="text-sm text-muted-foreground">
            Showing {products.length} products
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFilterCount} filters applied
              </Badge>
            )}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <ProductFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            categories={mockCategories}
            priceRange={priceRange}
            className="lg:sticky lg:top-24"
          />
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <LoadingCardSkeleton key={index} />
              ))}
            </div>
          ) : (
            <ProductGrid
              products={products}
              loading={loading}
              error={error}
              viewMode={viewMode}
            />
          )}
        </div>
      </div>
    </div>
  );
}
