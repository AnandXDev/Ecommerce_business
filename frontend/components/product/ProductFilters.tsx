'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { Separator } from '@/components/ui/Separator';
import { 
  Filter, 
  X, 
  ChevronDown, 
  ChevronUp,
  SlidersHorizontal
} from 'lucide-react';

interface FilterState {
  category: string[];
  priceRange: [number, number];
  rating: number;
  inStock: boolean;
  onSale: boolean;
  featured: boolean;
  newArrivals: boolean;
}

interface ProductFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  categories: Array<{ name: string; slug: string; count: number }>;
  priceRange: { min: number; max: number };
  className?: string;
}

export function ProductFilters({
  filters,
  onFiltersChange,
  categories,
  priceRange,
  className = ''
}: ProductFiltersProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    categories: true,
    price: true,
    rating: true,
    availability: true,
    features: true
  });
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [tempPriceRange, setTempPriceRange] = useState<[number, number]>([
    filters.priceRange[0],
    filters.priceRange[1]
  ]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCategoryChange = (categorySlug: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.category, categorySlug]
      : filters.category.filter(c => c !== categorySlug);
    
    onFiltersChange({
      ...filters,
      category: newCategories
    });
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    setTempPriceRange([min, max]);
  };

  const applyPriceRange = () => {
    onFiltersChange({
      ...filters,
      priceRange: tempPriceRange
    });
  };

  const handleRatingChange = (rating: number) => {
    onFiltersChange({
      ...filters,
      rating: filters.rating === rating ? 0 : rating
    });
  };

  const handleAvailabilityChange = (type: 'inStock' | 'onSale', checked: boolean) => {
    onFiltersChange({
      ...filters,
      [type]: checked
    });
  };

  const handleFeatureChange = (type: 'featured' | 'newArrivals', checked: boolean) => {
    onFiltersChange({
      ...filters,
      [type]: checked
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      category: [],
      priceRange: [priceRange.min, priceRange.max],
      rating: 0,
      inStock: false,
      onSale: false,
      featured: false,
      newArrivals: false
    });
    setTempPriceRange([priceRange.min, priceRange.max]);
  };

  const hasActiveFilters = 
    filters.category.length > 0 ||
    filters.priceRange[0] > priceRange.min ||
    filters.priceRange[1] < priceRange.max ||
    filters.rating > 0 ||
    filters.inStock ||
    filters.onSale ||
    filters.featured ||
    filters.newArrivals;

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
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <Button
          onClick={() => setIsMobileOpen(true)}
          variant="outline"
          className="w-full"
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Filters Sidebar */}
      <div className={`${className} ${isMobileOpen ? 'fixed inset-0 z-50 lg:relative lg:inset-auto' : ''}`}>
        {/* Mobile Overlay */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 bg-black/50 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        {/* Filters Content */}
        <div className={`bg-background border rounded-lg p-6 h-full overflow-y-auto ${
          isMobileOpen ? 'fixed inset-y-0 left-0 w-80 z-50 lg:static lg:w-auto lg:inset-auto' : ''
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFilterCount}
                </Badge>
              )}
            </h2>
            
            <div className="flex items-center space-x-2">
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-muted-foreground"
                >
                  Clear All
                </Button>
              )}
              
              {isMobileOpen && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileOpen(false)}
                  className="lg:hidden"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection('categories')}
              className="flex items-center justify-between w-full text-left mb-3"
            >
              <h3 className="font-medium">Categories</h3>
              {expandedSections.categories ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            
            {expandedSections.categories && (
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.slug} className="flex items-center justify-between">
                    <Checkbox
                      id={`category-${category.slug}`}
                      checked={filters.category.includes(category.slug)}
                      onChange={(e) => 
                        handleCategoryChange(category.slug, e.target.checked as boolean)
                      }
                      label={category.name}
                    />
                    <span className="text-sm text-muted-foreground">
                      ({category.count})
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Price Range */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection('price')}
              className="flex items-center justify-between w-full text-left mb-3"
            >
              <h3 className="font-medium">Price Range</h3>
              {expandedSections.price ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            
            {expandedSections.price && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={tempPriceRange[0]}
                    onChange={(e) => handlePriceRangeChange(
                      parseInt(e.target.value) || priceRange.min,
                      tempPriceRange[1]
                    )}
                    className="w-full"
                  />
                  <span className="text-muted-foreground">-</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={tempPriceRange[1]}
                    onChange={(e) => handlePriceRangeChange(
                      tempPriceRange[0],
                      parseInt(e.target.value) || priceRange.max
                    )}
                    className="w-full"
                  />
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={applyPriceRange}
                  className="w-full"
                >
                  Apply Price Range
                </Button>
                
                <div className="text-sm text-muted-foreground">
                  Range: ${priceRange.min} - ${priceRange.max}
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Rating */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection('rating')}
              className="flex items-center justify-between w-full text-left mb-3"
            >
              <h3 className="font-medium">Customer Rating</h3>
              {expandedSections.rating ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            
            {expandedSections.rating && (
              <div className="space-y-2">
                {[4, 3, 2, 1].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => handleRatingChange(rating)}
                    className={`flex items-center space-x-2 w-full text-left p-2 rounded hover:bg-accent transition-colors ${
                      filters.rating === rating ? 'bg-accent' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-sm ${
                            i < rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm">& Up</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Availability */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection('availability')}
              className="flex items-center justify-between w-full text-left mb-3"
            >
              <h3 className="font-medium">Availability</h3>
              {expandedSections.availability ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            
            {expandedSections.availability && (
              <div className="space-y-2">
                <Checkbox
                  id="inStock"
                  checked={filters.inStock}
                  onChange={(e) => 
                    handleAvailabilityChange('inStock', e.target.checked as boolean)
                  }
                  label="In Stock Only"
                />
                <Checkbox
                  id="onSale"
                  checked={filters.onSale}
                  onChange={(e) => 
                    handleAvailabilityChange('onSale', e.target.checked as boolean)
                  }
                  label="On Sale"
                />
              </div>
            )}
          </div>

          <Separator />

          {/* Features */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection('features')}
              className="flex items-center justify-between w-full text-left mb-3"
            >
              <h3 className="font-medium">Features</h3>
              {expandedSections.features ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            
            {expandedSections.features && (
              <div className="space-y-2">
                <Checkbox
                  id="featured"
                  checked={filters.featured}
                  onChange={(e) => 
                    handleFeatureChange('featured', e.target.checked as boolean)
                  }
                  label="Featured Products"
                />
                <Checkbox
                  id="newArrivals"
                  checked={filters.newArrivals}
                  onChange={(e) => 
                    handleFeatureChange('newArrivals', e.target.checked as boolean)
                  }
                  label="New Arrivals"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
