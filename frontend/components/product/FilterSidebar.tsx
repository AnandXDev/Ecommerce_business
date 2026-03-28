"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Separator } from "@/components/ui/Separator";
import { X, Star, DollarSign } from "lucide-react";

interface FilterSidebarProps {
  filters: {
    category: string;
    priceRange: [number, number];
    rating: number;
    sortBy: string;
    brand?: string;
  };
  onFilterChange: (filters: any) => void;
  onClearFilters: () => void;
  categories?: Array<{ _id: string; name: string; productCount: number }>;
  brands?: Array<{ name: string; count: number }>;
  isOpen?: boolean;
  onClose?: () => void;
}

export function FilterSidebar({
  filters,
  onFilterChange,
  onClearFilters,
  categories = [],
  brands = [],
  isOpen = true,
  onClose,
}: FilterSidebarProps) {
  const [localPriceRange, setLocalPriceRange] = useState(filters.priceRange);

  const handlePriceRangeChange = (index: number, value: number) => {
    const newRange: [number, number] = [...localPriceRange] as [number, number];
    newRange[index] = value;
    setLocalPriceRange(newRange);
  };

  const applyPriceRange = () => {
    onFilterChange({
      ...filters,
      priceRange: localPriceRange,
    });
  };

  const hasActiveFilters =
    filters.category ||
    filters.rating > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 1000 ||
    filters.brand;

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border ${isOpen ? "block" : "hidden"}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold text-lg">Filters</h3>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-red-600 hover:text-red-700"
            >
              Clear All
            </Button>
          )}
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Categories */}
        {categories.length > 0 && (
          <div>
            <h4 className="font-medium text-sm text-gray-900 mb-3">
              Categories
            </h4>
            <div className="space-y-2">
              {categories.map((category) => (
                <label
                  key={category._id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value={category.slug}
                      checked={filters.category === category.slug}
                      onChange={(e) =>
                        onFilterChange({ ...filters, category: e.target.value })
                      }
                      className="mr-3 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">
                      {category.name}
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {category.productCount}
                  </Badge>
                </label>
              ))}
            </div>
          </div>
        )}

        {categories.length > 0 && <Separator />}

        {/* Price Range */}
        <div>
          <h4 className="font-medium text-sm text-gray-900 mb-3">
            <DollarSign className="h-4 w-4 inline mr-1" />
            Price Range
          </h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">$</span>
              <input
                type="number"
                min="0"
                max={localPriceRange[1]}
                value={localPriceRange[0]}
                onChange={(e) =>
                  handlePriceRangeChange(0, parseInt(e.target.value) || 0)
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-primary focus:border-primary"
                placeholder="Min"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                min={localPriceRange[0]}
                max="10000"
                value={localPriceRange[1]}
                onChange={(e) =>
                  handlePriceRangeChange(1, parseInt(e.target.value) || 0)
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-primary focus:border-primary"
                placeholder="Max"
              />
            </div>
            <Button
              size="sm"
              onClick={applyPriceRange}
              disabled={
                localPriceRange[0] === filters.priceRange[0] &&
                localPriceRange[1] === filters.priceRange[1]
              }
              className="w-full"
            >
              Apply Price Range
            </Button>
          </div>
        </div>

        <Separator />

        {/* Rating */}
        <div>
          <h4 className="font-medium text-sm text-gray-900 mb-3">
            <Star className="h-4 w-4 inline mr-1" />
            Minimum Rating
          </h4>
          <div className="space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <label
                key={rating}
                className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="radio"
                  name="rating"
                  value={rating}
                  checked={filters.rating === rating}
                  onChange={(e) =>
                    onFilterChange({
                      ...filters,
                      rating: parseInt(e.target.value),
                    })
                  }
                  className="mr-3 text-primary focus:ring-primary"
                />
                <div className="flex items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">& Up</span>
                </div>
              </label>
            ))}
            <label className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="rating"
                value="0"
                checked={filters.rating === 0}
                onChange={(e) => onFilterChange({ ...filters, rating: 0 })}
                className="mr-3 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-600">All Ratings</span>
            </label>
          </div>
        </div>

        {/* Brands */}
        {brands.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="font-medium text-sm text-gray-900 mb-3">Brands</h4>
              <div className="space-y-2">
                {brands.map((brand) => (
                  <label
                    key={brand.name}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="brand"
                        value={brand.name}
                        checked={
                          filters.brand?.toLowerCase() ===
                          brand.name.toLowerCase()
                        }
                        onChange={(e) =>
                          onFilterChange({
                            ...filters,
                            brand: e.target.value.toLowerCase(),
                          })
                        }
                        className="mr-3 text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-gray-700">
                        {brand.name}
                      </span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {brand.count}
                    </Badge>
                  </label>
                ))}
              </div>
            </div>
          </>
        )}

        <Separator />

        {/* Sort By */}
        <div>
          <h4 className="font-medium text-sm text-gray-900 mb-3">Sort By</h4>
          <select
            value={filters.sortBy}
            onChange={(e) =>
              onFilterChange({ ...filters, sortBy: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-primary focus:border-primary"
          >
            <option value="featured">Featured</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest First</option>
            <option value="name">Name: A-Z</option>
          </select>
        </div>
      </div>
    </div>
  );
}
