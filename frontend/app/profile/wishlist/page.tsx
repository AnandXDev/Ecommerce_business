"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Heart, 
  ShoppingCart, 
  Trash2, 
  Star,
  Search,
  Filter,
  Grid,
  List,
  Eye
} from 'lucide-react';

interface WishlistItem {
  _id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  comparePrice?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  category: string;
  brand?: string;
  addedDate: string;
}

export default function WishlistPage() {
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock wishlist data - replace with actual API call
      const mockWishlist: WishlistItem[] = [
        {
          _id: '1',
          productId: 'prod1',
          name: 'Wireless Bluetooth Headphones',
          image: '/api/placeholder/300/300',
          price: 99.99,
          comparePrice: 149.99,
          rating: 4.5,
          reviewCount: 128,
          inStock: true,
          category: 'Electronics',
          brand: 'Sony',
          addedDate: '2024-01-15'
        },
        {
          _id: '2',
          productId: 'prod2',
          name: 'Smart Watch Pro',
          image: '/api/placeholder/300/300',
          price: 299.99,
          rating: 4.8,
          reviewCount: 89,
          inStock: true,
          category: 'Electronics',
          brand: 'Apple',
          addedDate: '2024-01-18'
        },
        {
          _id: '3',
          productId: 'prod3',
          name: 'Laptop Stand Aluminum',
          image: '/api/placeholder/300/300',
          price: 49.99,
          comparePrice: 69.99,
          rating: 4.2,
          reviewCount: 45,
          inStock: false,
          category: 'Accessories',
          brand: 'Rain Design',
          addedDate: '2024-01-20'
        },
        {
          _id: '4',
          productId: 'prod4',
          name: 'Mechanical Keyboard RGB',
          image: '/api/placeholder/300/300',
          price: 129.99,
          rating: 4.6,
          reviewCount: 203,
          inStock: true,
          category: 'Electronics',
          brand: 'Logitech',
          addedDate: '2024-01-22'
        }
      ];

      setWishlistItems(mockWishlist);
    } catch (err) {
      setError('Failed to fetch wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (item: WishlistItem) => {
    try {
      await addItem({
        productId: item.productId,
        slug: item.productId,
        name: item.name,
        images: [{ url: item.image, alt: item.name }],
        price: item.price,
        comparePrice: item.comparePrice,
        quantity: 1
      });
      toast.success(`${item.name} added to cart!`);
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const handleRemoveFromWishlist = (itemId: string, itemName: string) => {
    setWishlistItems(prev => prev.filter(item => item._id !== itemId));
    toast.success(`${itemName} removed from wishlist`);
  };

  const handleAddAllToCart = async () => {
    const inStockItems = wishlistItems.filter(item => item.inStock);
    
    for (const item of inStockItems) {
      try {
        await addItem({
          productId: item.productId,
          slug: item.productId,
          name: item.name,
          images: [{ url: item.image, alt: item.name }],
          price: item.price,
          comparePrice: item.comparePrice,
          quantity: 1
        });
      } catch (error) {
        console.error(`Failed to add ${item.name} to cart`);
      }
    }
    
    toast.success(`${inStockItems.length} items added to cart!`);
  };

  const filteredItems = wishlistItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.brand && item.brand.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(wishlistItems.map(item => item.category)))];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h1>
          <p className="text-gray-600 mb-6">You need to be signed in to view your wishlist</p>
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gray-50"
    >
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                My Wishlist
              </h1>
              <p className="text-gray-600">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>
            {wishlistItems.length > 0 && (
              <Button onClick={handleAddAllToCart} className="mt-4 sm:mt-0">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add All to Cart
              </Button>
            )}
          </div>
        </div>

        {/* Filters */}
        {wishlistItems.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-lg shadow-sm p-4 mb-6"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search wishlist items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="capitalize"
                  >
                    {category}
                  </Button>
                ))}
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
          </motion.div>
        )}

        {/* Wishlist Items */}
        {loading ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="animate-pulse">
                  <div className="aspect-square bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchWishlist}>Try Again</Button>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {wishlistItems.length === 0 ? 'Your wishlist is empty' : 'No matching items found'}
            </h3>
            <p className="text-gray-600 mb-6">
              {wishlistItems.length === 0 
                ? 'Start adding items to your wishlist to see them here'
                : 'Try adjusting your search or filters'
              }
            </p>
            <div className="flex gap-4 justify-center">
              {(searchTerm || selectedCategory !== 'all') && (
                <Button variant="outline" onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}>
                  Clear Filters
                </Button>
              )}
              <Link href="/products">
                <Button>Browse Products</Button>
              </Link>
            </div>
          </div>
        ) : (
          <motion.div
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            initial="hidden"
            animate="visible"
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            }
          >
            {filteredItems.map((item, index) => (
              <motion.div
                key={item._id}
                variants={itemVariants}
                className={viewMode === 'list' ? 'bg-white rounded-lg shadow-sm p-4' : ''}
              >
                {viewMode === 'grid' ? (
                  // Grid View
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden group">
                    <div className="relative">
                      <div className="aspect-square bg-gray-100">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={300}
                          height={300}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <button
                        onClick={() => handleRemoveFromWishlist(item._id, item.name)}
                        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors group"
                      >
                        <Heart className="h-4 w-4 text-red-500 group-hover:scale-110 transition-transform" />
                      </button>
                      {!item.inStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Badge variant="destructive">Out of Stock</Badge>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="mb-2">
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {item.name}
                      </h3>
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(item.rating)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 ml-2">
                          ({item.reviewCount})
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="text-lg font-bold text-gray-900">
                            {formatPrice(item.price)}
                          </span>
                          {item.comparePrice && (
                            <span className="text-sm text-gray-500 line-through ml-2">
                              {formatPrice(item.comparePrice)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleAddToCart(item)}
                          disabled={!item.inStock}
                          className="flex-1"
                          size="sm"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </Button>
                        <Link href={`/product/${item.productId}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  // List View
                  <div className="flex items-center space-x-4">
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {item.name}
                          </h3>
                          <div className="flex items-center mb-2">
                            <Badge variant="outline" className="text-xs mr-2">
                              {item.category}
                            </Badge>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < Math.floor(item.rating)
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                              <span className="text-sm text-gray-600 ml-1">
                                ({item.reviewCount})
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveFromWishlist(item._id, item.name)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Heart className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold text-gray-900">
                            {formatPrice(item.price)}
                          </span>
                          {item.comparePrice && (
                            <span className="text-sm text-gray-500 line-through ml-2">
                              {formatPrice(item.comparePrice)}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleAddToCart(item)}
                            disabled={!item.inStock}
                            size="sm"
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                          </Button>
                          <Link href={`/product/${item.productId}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
