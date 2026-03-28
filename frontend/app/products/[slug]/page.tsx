"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Separator } from "@/components/ui/Separator";
import {
  ShoppingCart,
  Heart,
  Share2,
  Star,
  Truck,
  Package,
  Shield,
  ChevronLeft,
  Plus,
  Minus,
} from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isBuying, setIsBuying] = useState(false);
const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const slug = params.slug as string;

  // Fetch product details from API
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/products/slug/${slug}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch product details");
        }

        const data = await response.json();

        if (data.success) {
          setProduct(data.data.product);
        } else {
          throw new Error(data.message || "Product not found");
        }
      } catch (error: any) {
        console.error("Error fetching product details:", error);
        setError(error.message || "Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProductDetails();
    }
  }, [slug]);

  // Debug logging
  useEffect(() => {
    console.log("=== PRODUCT PAGE DEBUG ===");
    console.log("Slug:", slug);
    console.log("Product:", product);
    console.log("Loading:", loading);
    console.log("Error:", error);
    console.log("========================");
  }, [slug, product, loading, error]);

  // Check if product exists and redirect if not
  useEffect(() => {
    if (!loading && !product && !error) {
      // Product not found after loading
      router.push("/products");
    }
  }, [loading, product, error, router]);

  // Debug logging for product data
  useEffect(() => {
    if (product) {
      console.log("=== PRODUCT DATA DEBUG ===");
      console.log("Product:", product);
      console.log("Category:", product.category);
      console.log("Pricing:", product.pricing);
      console.log("Images:", product.images);
      console.log("Inventory:", product.inventory);
      console.log("=======================");
    }
  }, [product]);

  const {
    name,
    images,
    pricing,
    category,
    rating,
    inventory,
    shipping,
    description,
    featured,
    status,
    visibility,
  } = product || {};

  const safeCategory = category || {
    name: "No Category",
    slug: "",
  };
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The product you're looking for doesn't exist.
          </p>
          <Button onClick={() => router.push("/products")}>
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const isInStock = (inventory?.quantity || 0) > 0;
  const hasDiscount =
    pricing?.comparePrice && pricing.comparePrice > (pricing?.basePrice || 0);
  const isActive = status === "active" && visibility === "public";

  const handleAddToCart = async () => {
    if (!isInStock) return;

    setIsAddingToCart(true);

    try {
      // ✅ safe product check
      if (!product || !product._id) {
        throw new Error("Product data not available");
      }

      await addItem({
        productId: product._id,
        slug: product?.slug || "",
        name: name || "Product",
        images: Array.isArray(images) ? images : [],
        price: pricing?.basePrice || 0,
        comparePrice: pricing?.comparePrice || undefined,
        quantity: quantity || 1,
      });

      // ✅ safe toast
      toast.success(`${name || "Product"} added to cart!`);
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to add to cart");
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
  if (!isInStock) return;

  setIsBuying(true);
  try {
    const tempCartItem = {
      productId: product._id,
      slug: product.slug,
      name: product.name,
      images: product.images,
      price: pricing?.basePrice || 0,
      comparePrice: pricing?.comparePrice || undefined,
      quantity,
    };

    sessionStorage.setItem(
      "tempCheckout",
      JSON.stringify({
        items: [tempCartItem],
        isBuyNow: true,
        productSlug: product.slug,
      })
    );

    console.log("Navigating to checkout..."); // DEBUG

    router.push("/checkout");
  } catch (error) {
    console.error(error);
    toast.error("Failed to process buy now");
  } finally {
    setIsBuying(false);
  }
};

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gray-50"
    >
      <div className="container-custom py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary">
            Products
          </Link>
          {category && (
            <>
              <span>/</span>
              <Link
                href={`/categories/${category.slug}`}
                className="hover:text-primary"
              >
                {category?.name || "Category"}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-gray-900">{name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square bg-white rounded-lg overflow-hidden">
                {images?.[selectedImageIndex] && (
                  <Image
                    src={images[selectedImageIndex].url}
                    alt={images[selectedImageIndex].alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {featured && <Badge variant="secondary">Featured</Badge>}
                  {hasDiscount && (
                    <Badge variant="destructive">
                      -
                      {Math.round(
                        ((pricing?.comparePrice - pricing?.basePrice) /
                          pricing?.comparePrice) *
                          100,
                      )}
                      %
                    </Badge>
                  )}
                </div>
              </div>

              {/* Thumbnail Images */}
              {images && images.length > 1 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {images?.map((image: { url: string; alt: string }, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        index === selectedImageIndex
                          ? "border-primary"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Image
                        src={image.url}
                        alt={image.alt}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Header */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="outline" className="text-xs">
                  {category?.name || "No Category"}
                </Badge>
                {isInStock ? (
                  <Badge variant="secondary" className="text-xs text-green-600">
                    In Stock
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="text-xs">
                    Out of Stock
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">{name}</h1>

              {/* Rating */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(rating?.average || 0)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {rating?.average?.toFixed(1) || "0.0"} ({rating?.count || 0}{" "}
                  reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(pricing?.basePrice || 0)}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      {formatPrice(pricing?.comparePrice || 0)}
                    </span>
                    <Badge variant="destructive">
                      Save{" "}
                      {formatPrice(
                        (pricing?.comparePrice || 0) -
                          (pricing?.basePrice || 0),
                      )}
                    </Badge>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{description}</p>
            </div>

            <Separator />

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-16 text-center font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    disabled={quantity >= 10}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={!isInStock || isAddingToCart}
                  className="flex-1"
                  size="lg"
                  variant="outline"
                >
                  {isAddingToCart ? (
                    <span className="flex items-center">
                      <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mr-2" />
                      Adding...
                    </span>
                  ) : !isInStock ? (
                    "Out of Stock"
                  ) : (
                    <span className="flex items-center">
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Add to Cart
                    </span>
                  )}
                </Button>

                <Button
                  onClick={handleBuyNow}
                  disabled={!isInStock || isBuying}
                  className="flex-1"
                  size="lg"
                >
                  {isBuying ? (
                    <span className="flex items-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Processing...
                    </span>
                  ) : !isInStock ? (
                    "Out of Stock"
                  ) : (
                    "Buy Now"
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={isWishlisted ? "border-red-500 text-red-500" : ""}
                >
                  <Heart
                    className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`}
                  />
                </Button>

                <Button variant="outline" size="lg">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <Separator />

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                <Truck className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-sm">Free Shipping</p>
                  <p className="text-xs text-gray-600">On orders over $50</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-sm">Secure Payment</p>
                  <p className="text-xs text-gray-600">SSL encrypted</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Package className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-medium text-sm">Easy Returns</p>
                  <p className="text-xs text-gray-600">30-day policy</p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium mb-2">Product Details</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>SKU:</span>
                  <span className="font-medium">N/A</span>
                </div>
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span className="font-medium">{category?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Availability:</span>
                  <span
                    className={`font-medium ${isInStock ? "text-green-600" : "text-red-600"}`}
                  >
                    {isInStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
