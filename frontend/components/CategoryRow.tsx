"use client";

import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { ArrowRight } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  image?: string;
  productCount?: number;
}

interface CategoryRowProps {
  categories: Category[];
  title?: string;
  showAll?: boolean;
}

export function CategoryRow({ categories, title, showAll = false }: CategoryRowProps) {
  return (
    <section className="py-6 bg-white rounded-lg"  >
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h2  style={{backgroundColor: "#fbbc05"}} className="text-2xl font-bold text-foreground">{title}</h2>
          {showAll && (
            <Link href="/categories" className="flex  items-center text-primary hover:text-primary/80 transition-colors">
              <span className="text-sm font-medium">View All</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          )}
        </div>
      )}
      
      <div className="flex gap-12 px-4 py-6 pb-8 overflow-x-auto rounded-lg scrollbar-hide ">
        {categories.map((category) => (
          <Link
            key={category._id}
            href={`/products?category=${category.slug}`}
            className="flex-shrink-0  group"
          >
            <div className="flex flex-col  items-center p-4 bg-card rounded-lg border hover:shadow-md transition-all hover:scale-105 min-w-[100px]">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center text-2xl mb-3 group-hover:from-primary/30 group-hover:to-primary/20 transition-colors">
                {category.icon || '📦'}
              </div>
              
              <h3 className="text-sm font-medium text-foreground text-center group-hover:text-primary transition-colors">
                {category.name}
              </h3>
              
              {category.productCount && (
                <Badge variant="secondary" className="mt-2 text-xs">
                  {category.productCount}
                </Badge>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
