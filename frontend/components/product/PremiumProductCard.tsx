"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  Eye, 
  Zap,
  Package,
  Shield,
  Truck
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice?: number;
    images: Array<{ url: string; alt: string }>;
    rating: number;
    reviews: number;
    badge?: string;
    discount?: number;
    inStock: boolean;
    features?: string[];
  };
  className?: string;
}

export function PremiumProductCard({ product, className = "" }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const discountPercentage = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <motion.div
      className={`group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      layout
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        {/* Image Skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        
        {/* Main Image */}
        <Image
          src={product.images[0]?.url || "/placeholder-product.jpg"}
          alt={product.images[0]?.alt || product.name}
          fill
          className={`object-cover transition-all duration-700 ${isHovered ? "scale-110" : "scale-100"}`}
          onLoad={() => setImageLoaded(true)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Hover Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-black/40 flex items-center justify-center"
        >
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/90 hover:bg-white text-gray-900 h-10 w-10 p-0 rounded-full"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/90 hover:bg-white text-gray-900 h-10 w-10 p-0 rounded-full"
              onClick={() => setIsWishlisted(!isWishlisted)}
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
          </div>
        </motion.div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
          {product.badge && (
            <Badge className="bg-gradient-to-r from-primary-500 to-primary-600 text-white border-0">
              {product.badge}
            </Badge>
          )}
          {discountPercentage > 0 && (
            <Badge className="bg-red-500 text-white border-0">
              -{discountPercentage}%
            </Badge>
          )}
        </div>

        {/* Quick Add Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="absolute bottom-3 left-3 right-3"
        >
          <Button
            size="sm"
            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium shadow-lg"
            disabled={!product.inStock}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </Button>
        </motion.div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Product Name */}
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center space-x-1 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {product.rating} ({product.reviews})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline space-x-2 mb-3">
          <span className="text-xl font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
          {product.comparePrice && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>

        {/* Features */}
        {product.features && product.features.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.features.slice(0, 3).map((feature, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs bg-gray-100 text-gray-600 border-0"
              >
                {feature}
              </Badge>
            ))}
          </div>
        )}

        {/* Trust Indicators */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Truck className="h-3 w-3" />
              <span>Free Ship</span>
            </div>
            <div className="flex items-center space-x-1">
              <Shield className="h-3 w-3" />
              <span>Secure</span>
            </div>
          </div>
          {product.inStock && (
            <div className="flex items-center space-x-1 text-green-600">
              <Package className="h-3 w-3" />
              <span>In Stock</span>
            </div>
          )}
        </div>
      </div>

      {/* Hover Gradient Border */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/20 to-accent-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </motion.div>
  );
}
