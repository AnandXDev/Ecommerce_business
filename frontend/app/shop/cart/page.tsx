"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Separator } from '@/components/ui/Separator';
import { Input } from '@/components/ui/Input';
import { CartItem } from '@/components/cart/CartItem';
import { 
  ShoppingBag, 
  ArrowLeft,
  Plus,
  Minus,
  Trash2,
  Shield,
  Truck,
  RefreshCw,
  Tag
} from 'lucide-react';
import { formatPrice, calculateItemTotal, calculateSavings } from '@/hooks/useCart';

export default function CartPage() {
  const { cart, updateQuantity, removeItem, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Calculate totals
  const shipping = cart.subtotal > 50 ? 0 : 9.99;
  const tax = cart.subtotal * 0.08;
  const discount = appliedPromo ? cart.subtotal * 0.1 : 0; // 10% discount for demo
  const total = cart.subtotal + shipping + tax - discount;

  const handlePromoCodeApply = () => {
    if (promoCode.trim()) {
      setAppliedPromo(promoCode.trim());
      setPromoCode('');
    }
  };

  const handlePromoCodeRemove = () => {
    setAppliedPromo(null);
  };

  const handleCheckout = () => {
    setIsUpdating(true);
    // Navigate to checkout
    window.location.href = '/checkout';
  };

  const handleClearCart = () => {
    if (confirm('Are you sure you want to clear your cart? This action cannot be undone.')) {
      clearCart();
    }
  };

  const totalSavings = cart.items.reduce((total, item) => total + calculateSavings(item), 0);

  return (
    <div className="container-custom py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link href="/shop/products" className="flex items-center text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
          <Separator orientation="vertical" className="h-6" />
          <h1 className="text-2xl font-bold text-foreground">
            Shopping Cart
            {cart.itemCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'}
              </Badge>
            )}
          </h1>
        </div>
        
        {cart.items.length > 0 && (
          <Button
            variant="outline"
            onClick={handleClearCart}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Cart
          </Button>
        )}
      </div>

      {cart.items.length === 0 ? (
        // Empty Cart
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Your cart is empty
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
          </p>
          <Link href="/shop/products">
            <Button size="lg">
              Start Shopping
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-background rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-6">
                Cart Items ({cart.itemCount})
              </h2>
              
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.id}>
                    <CartItem item={item} />
                    <Separator className="my-4" />
                  </div>
                ))}
              </div>

              {/* Savings Alert */}
              {totalSavings > 0 && (
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center space-x-2 text-green-700 dark:text-green-300">
                    <Tag className="h-5 w-5" />
                    <span className="font-medium">
                      You're saving {formatPrice(totalSavings)} on this order!
                    </span>
                  </div>
                </div>
              )}

              {/* Recommended Products */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">You might also like</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Mock recommended products */}
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="w-full h-32 bg-gray-100 rounded mb-3"></div>
                      <h4 className="font-medium text-sm mb-1">Recommended Product {i}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{formatPrice(29.99)}</p>
                      <Button size="sm" className="w-full">Add to Cart</Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-background rounded-lg border p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-6">Order Summary</h2>

              {/* Promo Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Promo Code
                </label>
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    onClick={handlePromoCodeApply}
                    disabled={!promoCode.trim()}
                  >
                    Apply
                  </Button>
                </div>
                
                {appliedPromo && (
                  <div className="mt-2 flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
                    <span className="text-sm text-green-700 dark:text-green-300">
                      {appliedPromo} applied
                    </span>
                    <button
                      onClick={handlePromoCodeRemove}
                      className="text-green-600 hover:text-green-700"
                    >
                      <Plus className="h-3 w-3 rotate-45" />
                    </button>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatPrice(cart.subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedPromo})</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'Free' : formatPrice(shipping)}
                  </span>
                </div>

                {cart.subtotal > 50 && (
                  <div className="flex items-center text-sm text-green-600">
                    <Truck className="h-3 w-3 mr-1" />
                    <span>You qualified for free shipping!</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-medium">{formatPrice(tax)}</span>
                </div>

                <Separator />

                <div className="flex justify-between">
                  <span className="font-semibold text-lg">Total</span>
                  <span className="font-semibold text-lg">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-2 mb-6 text-xs text-center">
                <div className="flex flex-col items-center space-y-1 p-2 bg-accent/50 rounded">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>Secure</span>
                </div>
                <div className="flex flex-col items-center space-y-1 p-2 bg-accent/50 rounded">
                  <RefreshCw className="h-4 w-4 text-primary" />
                  <span>Easy Returns</span>
                </div>
                <div className="flex flex-col items-center space-y-1 p-2 bg-accent/50 rounded">
                  <Truck className="h-4 w-4 text-primary" />
                  <span>Fast Shipping</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                onClick={handleCheckout}
                className="w-full"
                size="lg"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <span className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Processing...
                  </span>
                ) : (
                  <span>Proceed to Checkout</span>
                )}
              </Button>

              {/* Security Note */}
              <div className="text-center text-xs text-muted-foreground mt-4">
                <div className="flex items-center justify-center space-x-2">
                  <Shield className="h-3 w-3" />
                  <span>Secure checkout powered by SSL encryption</span>
                </div>
              </div>

              {/* Accepted Payments */}
              <div className="mt-6 pt-6 border-t">
                <p className="text-xs text-muted-foreground mb-3">We accept:</p>
                <div className="flex space-x-2">
                  <div className="w-8 h-5 bg-gray-200 rounded"></div>
                  <div className="w-8 h-5 bg-gray-200 rounded"></div>
                  <div className="w-8 h-5 bg-gray-200 rounded"></div>
                  <div className="w-8 h-5 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
