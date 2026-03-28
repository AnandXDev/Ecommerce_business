"use client";

import { useCart } from '@/hooks/useCart';
import { Separator } from '@/components/ui/Separator';
import { Button } from '@/components/ui/Button';
import { Truck, Shield } from 'lucide-react';

interface OrderSummaryProps {
  onCheckout?: () => void;
  showCheckoutButton?: boolean;
  isProcessing?: boolean;
}

export function OrderSummary({ 
  onCheckout, 
  showCheckoutButton = true,
  isProcessing = false 
}: OrderSummaryProps) {
  const { cart } = useCart();

  const calculateShipping = () => {
    return cart.subtotal > 50 ? 0 : 9.99;
  };

  const calculateTax = () => {
    return cart.subtotal * 0.08; // 8% tax
  };

  const calculateTotal = () => {
    return cart.subtotal + calculateShipping() + calculateTax();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (cart.items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
        <p className="text-gray-500 text-center py-4">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-6">Order Summary</h3>
      
      <div className="space-y-4">
        {/* Items */}
        <div className="space-y-3">
          {cart.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <div className="flex-1">
                <p className="font-medium text-gray-900 line-clamp-1">
                  {item.name}
                </p>
                <p className="text-gray-500">
                  {formatPrice(item.price)} × {item.quantity}
                </p>
              </div>
              <span className="font-medium text-gray-900 ml-4">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <Separator />

        {/* Totals */}
        <div className="space-y-3">
          {/* Subtotal */}
          <div className="flex justify-between text-gray-600">
            <span>Subtotal ({cart.itemCount} items)</span>
            <span>{formatPrice(cart.subtotal)}</span>
          </div>

          {/* Shipping */}
          <div className="flex justify-between text-gray-600">
            <div className="flex items-center">
              <Truck className="h-4 w-4 mr-2" />
              Shipping
            </div>
            <span>
              {calculateShipping() === 0 ? 'FREE' : formatPrice(calculateShipping())}
            </span>
          </div>

          {/* Tax */}
          <div className="flex justify-between text-gray-600">
            <span>Tax</span>
            <span>{formatPrice(calculateTax())}</span>
          </div>

          {/* Discount if any */}
          {cart.discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-{formatPrice(cart.discount)}</span>
            </div>
          )}

          <Separator />

          {/* Total */}
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span className="text-primary">
              {formatPrice(calculateTotal())}
            </span>
          </div>
        </div>

        {/* Free Shipping Notice */}
        {cart.subtotal < 50 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
            <p className="text-green-800">
              🎉 Add {formatPrice(50 - cart.subtotal)} more for free shipping!
            </p>
          </div>
        )}

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-blue-600" />
            <p className="text-blue-800">
              Secure checkout with SSL encryption
            </p>
          </div>
        </div>

        {/* Checkout Button */}
        {showCheckoutButton && onCheckout && (
          <Button
            onClick={onCheckout}
            disabled={isProcessing || cart.items.length === 0}
            className="w-full"
            size="lg"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Processing...
              </span>
            ) : (
              'Proceed to Checkout'
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
