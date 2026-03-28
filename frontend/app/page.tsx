"use client";

import { useState, useEffect } from 'react';
import { HeroBanner } from '@/components/HeroBanner';
import { CategoryRow } from '@/components/CategoryRow';
import { SectionHeader } from '@/components/SectionHeader';
import { ProductGrid } from '@/components/ProductGrid';
import { FeaturedProducts } from '@/components/product/FeaturedProducts';
import { useProducts } from '@/hooks/useProducts';
import { Loading } from '@/components/ui/Loading';

export default function HomePage() {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [gadgets, setGadgets] = useState([]);
  const [homeEssentials, setHomeEssentials] = useState([]);
  const [fitness, setFitness] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Categories for navigation
  const categories = [
    { _id: '1', name: 'Electronics', slug: 'electronics', icon: '📱', productCount: 234 },
    { _id: '2', name: 'Home & Kitchen', slug: 'home-kitchen', icon: '🏠', productCount: 156 },
    { _id: '3', name: 'Fashion', slug: 'fashion', icon: '👔', productCount: 189 },
    { _id: '4', name: 'Fitness', slug: 'fitness', icon: '💪', productCount: 98 },
    { _id: '5', name: 'Beauty', slug: 'beauty', icon: '💄', productCount: 76 },
    { _id: '6', name: 'Accessories', slug: 'accessories', icon: '⌚', productCount: 45 }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Fetch different product categories
      const [trendingRes, gadgetsRes, homeRes, fitnessRes, allRes] = await Promise.all([
        fetch('/api/products?featured=true&limit=8'),
        fetch('/api/products?category=electronics&limit=8'),
        fetch('/api/products?category=home-living&limit=8'),
        fetch('/api/products?category=sports&limit=8'),
        fetch('/api/products?limit=12')
      ]);

      const [trendingData, gadgetsData, homeData, fitnessData, allData] = await Promise.all([
        trendingRes.json(),
        gadgetsRes.json(),
        homeRes.json(),
        fitnessRes.json(),
        allRes.json()
      ]);

      setTrendingProducts(trendingData.data?.products || []);
      setGadgets(gadgetsData.data?.products || []);
      setHomeEssentials(homeData.data?.products || []);
      setFitness(fitnessData.data?.products || []);
      setAllProducts(allData.data?.products || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <HeroBanner />

      {/* Categories Navigation */}
      <section className="py-8 bg-muted/30">
        <div className="container-custom rounded-lg py-4  " style={{backgroundColor:"#fbbc05"}} >
          <SectionHeader 
            title="Shop by Category" 
            subtitle="Browse our wide selection of products"
            viewAllHref="/categories"
          />
          <CategoryRow 
            categories={categories} 
            showAll={true}
          />
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-12 bg-gray-300">
        <div className="container-custom py-4 ">
          <SectionHeader 
            title="Trending Now" 
            subtitle="Hot products everyone's talking about"
            viewAllHref="/products?sort=trending"
            badge="🔥 Trending"
          />
          <ProductGrid 
            products={trendingProducts} 
            columns={4}
          />
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-muted/30">
        <div className="container-custom">
          <FeaturedProducts />
        </div>
      </section>

      {/* Category Product Sections */}
      <section className="py-12">
        <div className="container-custom space-y-16">
          {/* Trending Gadgets */}
          <div>
            <SectionHeader 
              title="Trending Gadgets" 
              subtitle="Latest electronics and tech accessories"
              viewAllHref="/products?category=electronics"
              badge="📱 Tech"
            />
            <ProductGrid 
              products={gadgets} 
              columns={4}
            />
          </div>

          {/* Home Essentials */}
          <div>
            <SectionHeader 
              title="Home Essentials" 
              subtitle="Everything you need for your perfect home"
              viewAllHref="/products?category=home-living"
              badge="🏠 Home"
            />
            <ProductGrid 
              products={homeEssentials} 
              columns={4}
            />
          </div>

          {/* Fitness Products */}
          <div>
            <SectionHeader 
              title="Fitness & Sports" 
              subtitle="Gear up for your active lifestyle"
              viewAllHref="/products?category=sports"
              badge="💪 Fitness"
            />
            <ProductGrid 
              products={fitness} 
              columns={4}
            />
          </div>
        </div>
      </section>

      {/* All Products */}
      <section className="py-12 bg-muted/30">
        <div className="container-custom">
          <SectionHeader 
            title="All Products" 
            subtitle="Browse our complete collection"
            viewAllHref="/products"
          />
          <ProductGrid 
            products={allProducts} 
            columns={4}
          />
        </div>
      </section>
    </div>
  );
}
