"use client";

import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { ArrowRight, TrendingUp } from 'lucide-react';

interface CategoryCardProps {
  category: {
    _id: string;
    name: string;
    slug: string;
    icon?: string;
    image?: string;
    productCount: number;
    description?: string;
  };
  viewMode?: 'grid' | 'list';
  featured?: boolean;
}

export function CategoryCard({ category, viewMode = 'grid', featured = false }: CategoryCardProps) {
  if (viewMode === 'list') {
    return (
      <Link href={`/products?category=${category._id}`}>
        <div className="flex items-center gap-4 p-4 bg-card rounded-lg border hover:shadow-md transition-all hover:scale-[1.02] cursor-pointer group">
          <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center text-2xl">
            {category.image || '📦'}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {category.name}
              </h3>
              {featured && (
                <Badge variant="secondary" className="text-xs">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Popular
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {category.productCount} products available
            </p>
            {category.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                {category.description}
              </p>
            )}
          </div>
          
          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/products?category=${category._id}`}>
      <div className="group cursor-pointer">
        <div className="relative overflow-hidden rounded-lg bg-card border hover:shadow-lg transition-all hover:scale-[1.02]">
          {/* Category Image/Icon */}
          <div className="aspect-square bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center relative overflow-hidden">
            {category.image ? (
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            ) : (
              <div className="text-4xl">{category.icon || '📦'}</div>
            )}
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {/* Featured Badge */}
            {featured && (
              <Badge className="absolute top-3 right-3">
                <TrendingUp className="h-3 w-3 mr-1" />
                Popular
              </Badge>
            )}
          </div>
          
          {/* Content */}
          <div className="p-4">
            <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
              {category.name}
            </h3>
            
            <p className="text-sm text-muted-foreground mb-3">
              {category.productCount} products
            </p>
            
            {category.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                {category.description}
              </p>
            )}
            
            <div className="flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              Shop Now
              <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
