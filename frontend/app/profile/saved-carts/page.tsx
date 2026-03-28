"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Separator } from '@/components/ui/Separator';
import { 
  ShoppingCart, 
  Trash2, 
  RefreshCw,
  Calendar,
  Package,
  Plus,
  Clock
} from 'lucide-react';

interface SavedCartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  comparePrice?: number;
}

interface SavedCart {
  _id: string;
  name: string;
  items: SavedCartItem[];
  totalAmount: number;
  itemCount: number;
  createdAt: string;
  lastModified: string;
}

export default function SavedCartsPage() {
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const [savedCarts, setSavedCarts] = useState<SavedCart[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSavedCarts();
    }
  }, [isAuthenticated]);

  const fetchSavedCarts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock saved carts data - replace with actual API call
      const mockSavedCarts: SavedCart[] = [
        {
          _id: '1',
          name: 'Electronics Shopping',
          items: [
            {
              productId: 'prod1',
              name: 'Wireless Bluetooth Headphones',
              image: '/api/placeholder/80/80',
              price: 99.99,
              quantity: 1,
              comparePrice: 149.99
            },
            {
              productId: 'prod2',
              name: 'Smart Watch Pro',
              image: '/api/placeholder/80/80',
              price: 299.99,
              quantity: 1
            },
            {
              productId: 'prod3',
              name: 'Laptop Stand',
              image: '/api/placeholder/80/80',
              price: 49.99,
              quantity: 2
            }
          ],
          totalAmount: 599.95,
          itemCount: 4,
          createdAt: '2024-01-15',
          lastModified: '2024-01-18'
        },
        {
          _id: '2',
          name: 'Home Office Setup',
          items: [
            {
              productId: 'prod4',
              name: 'Mechanical Keyboard RGB',
              image: '/api/placeholder/80/80',
              price: 129.99,
              quantity: 1
            },
            {
              productId: 'prod5',
              name: 'Wireless Mouse',
              image: '/api/placeholder/80/80',
              price: 39.99,
              quantity: 1
            }
          ],
          totalAmount: 169.98,
          itemCount: 2,
          createdAt: '2024-01-20',
          lastModified: '2024-01-20'
        },
        {
          _id: '3',
          name: 'Gift Ideas',
          items: [
            {
              productId: 'prod6',
              name: 'Portable Speaker',
              image: '/api/placeholder/80/80',
              price: 79.99,
              quantity: 2,
              comparePrice: 99.99
            },
            {
              productId: 'prod7',
              name: 'Phone Case Premium',
              image: '/api/placeholder/80/80',
              price: 29.99,
              quantity: 3
            }
          ],
          totalAmount: 249.93,
          itemCount: 5,
          createdAt: '2024-01-10',
          lastModified: '2024-01-12'
        }
      ];

      setSavedCarts(mockSavedCarts);
    } catch (err) {
      setError('Failed to fetch saved carts');
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreCart = async (savedCart: SavedCart) => {
    try {
      // Add all items from saved cart to current cart
      for (const item of savedCart.items) {
        await addItem({
          productId: item.productId,
          slug: item.productId,
          name: item.name,
          images: [{ url: item.image, alt: item.name }],
          price: item.price,
          comparePrice: item.comparePrice,
          quantity: item.quantity
        });
      }
      
      toast.success(`Cart "${savedCart.name}" restored with ${savedCart.itemCount} items!`);
    } catch (error) {
      toast.error('Failed to restore cart');
    }
  };

  const handleAddItemToCart = async (item: SavedCartItem) => {
    try {
      await addItem({
        productId: item.productId,
        slug: item.productId,
        name: item.name,
        images: [{ url: item.image, alt: item.name }],
        price: item.price,
        comparePrice: item.comparePrice,
        quantity: item.quantity
      });
      toast.success(`${item.name} added to cart!`);
    } catch (error) {
      toast.error('Failed to add item to cart');
    }
  };

  const handleDeleteSavedCart = (cartId: string, cartName: string) => {
    setSavedCarts(prev => prev.filter(cart => cart._id !== cartId));
    toast.success(`Saved cart "${cartName}" deleted`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h1>
          <p className="text-gray-600 mb-6">You need to be signed in to view your saved carts</p>
          <Button onClick={() => window.location.href = '/login'}>
            Sign In
          </Button>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Saved Carts
          </h1>
          <p className="text-gray-600">
            Manage your saved shopping carts for later use
          </p>
        </div>

        {/* Saved Carts List */}
        {loading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/6 mb-6"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="h-20 bg-gray-200 rounded"></div>
                    <div className="h-20 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchSavedCarts}>Try Again</Button>
          </div>
        ) : savedCarts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No saved carts yet
            </h3>
            <p className="text-gray-600 mb-6">
              Save your shopping carts for later to easily continue shopping
            </p>
            <Button onClick={() => window.location.href = '/products'}>
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {savedCarts.map((cart, index) => (
              <motion.div
                key={cart._id}
                variants={itemVariants}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <div className="p-6">
                  {/* Cart Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {cart.name}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Created {formatDate(cart.createdAt)}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          Modified {formatDate(cart.lastModified)}
                        </div>
                        <div className="flex items-center">
                          <Package className="h-4 w-4 mr-1" />
                          {cart.itemCount} items
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="text-xl font-bold text-gray-900">
                          {formatPrice(cart.totalAmount)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Cart Items */}
                  <div className="mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {cart.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center space-x-3 p-3 border rounded-lg">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {item.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              Qty: {item.quantity} × {formatPrice(item.price)}
                            </p>
                            <div className="flex items-center justify-between mt-1">
                              <p className="font-semibold text-gray-900">
                                {formatPrice(item.price * item.quantity)}
                              </p>
                              {item.comparePrice && (
                                <Badge variant="secondary" className="text-xs">
                                  Save {formatPrice((item.comparePrice - item.price) * item.quantity)}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="mb-6" />

                  {/* Cart Actions */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={() => handleRestoreCart(cart)}
                      className="flex-1"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Restore Cart
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => window.location.href = '/products'}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Continue Shopping
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleDeleteSavedCart(cart._id, cart.name)}
                      className="text-red-600 hover:text-red-700 hover:border-red-300"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Info Section */}
        {savedCarts.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6"
          >
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  About Saved Carts
                </h3>
                <p className="text-blue-800 mb-3">
                  Saved carts allow you to store items you're interested in for later purchase. 
                  You can restore a saved cart at any time to add all items to your current cart.
                </p>
                <div className="space-y-2 text-sm text-blue-700">
                  <p>• Save multiple carts for different occasions or projects</p>
                  <p>• Items in saved carts are not reserved and may go out of stock</p>
                  <p>• Prices may change between saving and restoring a cart</p>
                  <p>• You can add individual items from saved carts to your current cart</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
