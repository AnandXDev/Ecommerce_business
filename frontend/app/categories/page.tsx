"use client";

import { useState, useEffect } from 'react';
import { CategoryCard } from '@/components/product/CategoryCard';
import { Loading } from '@/components/ui/Loading';
import { Button } from '@/components/ui/Button';
import { Search, Grid, List } from 'lucide-react';
import { Input } from '@/components/ui/Input';
type Category = {
  _id: string;
  name: string;
  slug: string; // ✅ FIX
  icon?: string;
  image?: string;
  productCount: number;
  description?: string;
};
export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchCategories();
  }, []);

 const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:5000/api/categories');

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();

      console.log("🔥 Categories API Response:", data); // ✅ DEBUG

      // ✅ Flexible handling
      const categoriesData =
        data?.data?.categories ||
        data?.categories ||
        [];

      setCategories(categoriesData);

    } catch (err: any) {
      console.error('❌ Error fetching categories:', err);
      setError(err.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(category =>
    category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Shop by Category
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Browse our wide selection of products organized by category
          </p>

          {/* Search and View Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center gap-2">
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
        </div>

        {/* Categories Grid/List */}
        {error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchCategories}>Try Again</Button>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-4">
              <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">No categories found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms
            </p>
            <Button onClick={() => setSearchTerm('')}>Clear Search</Button>
          </div>
        ) : (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {filteredCategories.map((category, index) => (
              <div
                key={category._id}
                className="animate-fadeIn"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CategoryCard category={category} viewMode={viewMode} />
              </div>
            ))}
          </div>
        )}

        {/* Featured Categories */}
        {!searchTerm && categories.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-foreground mb-8">
              Popular Categories
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories
                .filter(cat => cat.productCount > 50)
                .slice(0, 6)
                .map((category, index) => (
                  <div
                    key={category._id}
                    className="animate-fadeIn"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CategoryCard category={category} viewMode="grid" featured />
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
