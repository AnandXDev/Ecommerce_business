"use client";

import { useState, useEffect } from "react";
import { HeroBanner } from "@/components/HeroBanner";
import { CategoryRow } from "@/components/CategoryRow";
import { SectionHeader } from "@/components/SectionHeader";
import { ProductGrid } from "@/components/ProductGrid";
import { FeaturedProducts } from "@/components/product/FeaturedProducts";
import { useProducts } from "@/hooks/useProducts";
import { Loading } from "@/components/ui/Loading";
import ShapeGrid from "@/components/ShapeGrid";
import LogoLoop from "@/components/LogoLoop";
import {
  SiZara ,
  SiSony,
  SiAsus ,
  SiNike,
  SiAdidas,
} from "react-icons/si";

const techLogos = [
  // Ecommerce Brands 🔥
  
  {
    node: <SiZara  className="text-foreground"/>,
    title: "Zara",
    href: "https://zara.com",
  },
  {
    node: <SiSony />,
    title: "Sony",
    href: "https://sony.com",
  },
  {
    node: <SiAsus  />,
    title: "Asus",
    href: "https://asus.com",
  },

  // Fashion Brands 🔥
  {
    node: <SiNike />,
    title: "Nike",
    href: "https://nike.com",
  },
  {
    node: <SiAdidas />,
    title: "Adidas",
    href: "https://adidas.com",
  },
];

// Alternative with image sources
const imageLogos = [
  {
    src: "/logos/company1.png",
    alt: "Company 1",
    href: "https://company1.com",
  },
  {
    src: "/logos/company2.png",
    alt: "Company 2",
    href: "https://company2.com",
  },
  {
    src: "/logos/company3.png",
    alt: "Company 3",
    href: "https://company3.com",
  },
];

export default function HomePage() {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [gadgets, setGadgets] = useState([]);
  const [homeEssentials, setHomeEssentials] = useState([]);
  const [fitness, setFitness] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Categories for navigation
  const categories = [
  {
    _id: "1",
    name: "Electronics",
    slug: "electronics",
    image: "https://images.rawpixel.com/image_social_square/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTAzL3B4MTU5NTE5OS1pbWFnZS0wMS1qb2IxNzc1LWxmNjcxdmJ3LmpwZw.jpg",
    productCount: 234,
  },
  {
    _id: "2",
    name: "Home & Kitchen",
    slug: "home-kitchen",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=400",
    productCount: 156,
  },
  {
    _id: "3",
    name: "Fashion",
    slug: "fashion",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=400",
    productCount: 189,
  },
  {
    _id: "4",
    name: "Fitness",
    slug: "fitness",
    image: "https://images.unsplash.com/photo-1558611848-73f7eb4001ab?q=80&w=400",
    productCount: 98,
  },
  {
    _id: "5",
    name: "Beauty",
    slug: "beauty",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=400",
    productCount: 76,
  },
  {
    _id: "6",
    name: "Accessories",
    slug: "accessories",
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=400",
    productCount: 45,
  },

  {
  _id: "7",
  name: "Books & Stationery",
  slug: "books-stationery",
  image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400",
  productCount: 120,
},
{
  _id: "8",
  name: "Gaming",
  slug: "gaming",
  image: "https://images.unsplash.com/photo-1605902711622-cfb43c4437d1?q=80&w=400",
  productCount: 85,
},
];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      // Fetch different product categories
      const [trendingRes, gadgetsRes, homeRes, fitnessRes, allRes] =
        await Promise.all([
          fetch("/api/products?featured=true&limit=8"),
          fetch("/api/products?category=electronics&limit=8"),
          fetch("/api/products?category=home-living&limit=8"),
          fetch("/api/products?category=sports&limit=8"),
          fetch("/api/products?limit=12"),
        ]);

      const [trendingData, gadgetsData, homeData, fitnessData, allData] =
        await Promise.all([
          trendingRes.json(),
          gadgetsRes.json(),
          homeRes.json(),
          fitnessRes.json(),
          allRes.json(),
        ]);

      setTrendingProducts(trendingData.data?.products || []);
      setGadgets(gadgetsData.data?.products || []);
      setHomeEssentials(homeData.data?.products || []);
      setFitness(fitnessData.data?.products || []);
      setAllProducts(allData.data?.products || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
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
        <div
          className="container-custom rounded-lg py-4  "
          style={{ backgroundColor: "#fbbc05" }}
        >
          <SectionHeader
            title="Shop by Category"
            subtitle="Browse our wide selection of products"
            viewAllHref="/categories"
          />
          <CategoryRow categories={categories} showAll={true} />
        </div>
      </section>

<br />
      {/* LogoLoop here */}
      <div
        style={{ height: "200px", position: "relative", overflow: "hidden" }}
      >
        {/* Basic horizontal loop */}
        <LogoLoop
          logos={techLogos}
          speed={100}
          direction="left"
          logoHeight={60}
          gap={60}
          hoverSpeed={0}
          scaleOnHover
          fadeOut
          fadeOutColor="#ffffff"
          ariaLabel="Technology partners"
        />

        {/* Vertical loop with deceleration on hover */}
        {/* <LogoLoop
          logos={techLogos}
          speed={100}
          direction="left"
          logoHeight={60}
          gap={60}
          hoverSpeed={0}
          fadeOut
          useCustomRender={false}
        /> */}
      </div>

      {/* Trending Products */}
      <section className="relative py-12 bg-gradient-to-t from-purple-500 → to-yellow-500/30">
        {/* Background */}
        

        <div className="container-custom py-4">
          <SectionHeader
            title="Product For You"
            subtitle="Hot products everyone's talking about"
            viewAllHref="/products?sort=trending"
          />

          <ProductGrid products={trendingProducts} columns={4} />
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
             
            />
            <ProductGrid products={gadgets} columns={4} />
          </div>

          {/* Home Essentials */}
          <div>
            <SectionHeader
              title="Home Essentials"
              subtitle="Everything you need for your perfect home"
              viewAllHref="/products?category=home-living"
            
            />
            <ProductGrid products={homeEssentials} columns={4} />
          </div>

          {/* Fitness Products */}
          <div>
            <SectionHeader
              title="Fitness & Sports"
              subtitle="Gear up for your active lifestyle"
              viewAllHref="/products?category=sports"
            
            />
            <ProductGrid products={fitness} columns={4} />
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
          <ProductGrid products={allProducts} columns={4} />
        </div>
      </section>
    </div>
  );
}
