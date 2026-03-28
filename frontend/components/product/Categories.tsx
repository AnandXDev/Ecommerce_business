'use client';

import Link from 'next/link';
import { useState } from 'react';

interface Category {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  productCount: number;
}

export function Categories() {
  const [categories] = useState<Category[]>([
    {
      _id: '1',
      name: 'Electronics & Gadgets',
      slug: 'electronics',
      icon: '�',
      productCount: 234
    },
    {
      _id: '2',
      name: 'Fashion & Apparel',
      slug: 'fashion',
      icon: '�',
      productCount: 189
    },
    {
      _id: '3',
      name: 'Home & Living',
      slug: 'home-living',
      icon: '🏠',
      productCount: 156
    },
    {
      _id: '4',
      name: 'Beauty & Personal Care',
      slug: 'beauty',
      icon: '💄',
      productCount: 98
    },
    {
      _id: '5',
      name: 'Sports & Fitness',
      slug: 'sports',
      icon: '⚽',
      productCount: 67
    },
    {
      _id: '6',
      name: 'Toys & Games',
      slug: 'toys-games',
      icon: '🎮',
      productCount: 92
    }
  ]);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse our wide range of products across different categories
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category._id}
              href={`/products?category=${category.slug}`}
              className="group"
            >
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="text-4xl mb-4 text-center">
                  {category.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600 text-center">
                  {category.productCount} products
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
