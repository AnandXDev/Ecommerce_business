"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Separator } from "@/components/ui/Separator";
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  ArrowRight,
  Truck,
  Shield,
  RefreshCw,
} from "lucide-react";
import { CartItemCompact } from "./CartItem";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// Local formatPrice function to avoid import issues
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(price);
};

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { cart, clearCart, setIsCartOpen } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const handleCheckout = () => {
    setIsUpdating(true);
    // Navigate to checkout
    window.location.href = "/checkout";
  };

  const handleClearCart = () => {
    if (confirm("Are you sure you want to clear your cart?")) {
      clearCart();
    }
  };

  // Calculate shipping and tax
  const shipping = cart.subtotal > 500 ? 0 : 40; // Free shipping above ₹500
  const tax = cart.subtotal * 0.18; // 18% GST for India
  const total = cart.subtotal + shipping + tax;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-background shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="h-5 w-5" />
            <h2 className="text-lg font-semibold">
              Shopping Cart
              {cart.itemCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {cart.itemCount}
                </Badge>
              )}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Content */}
        <div className="flex flex-col h-full">
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cart.items.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Your cart is empty
                </h3>
                <p className="text-muted-foreground mb-6">
                  Looks like you haven't added anything to your cart yet
                </p>
                <Button onClick={onClose} className="w-full">
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {cart.items.map((item, index) => (
                  <CartItemCompact
                    key={`${item.productId || item.id || index}-${JSON.stringify(item.variant || {})}`} // Unique key using productId and variant
                    item={item}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          {cart.items.length > 0 && (
            <div className="border-t bg-background p-4">
              {/* Promo Code */}
              <div className="mb-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Promo code"
                    className="flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <Button variant="outline" size="sm">
                    Apply
                  </Button>
                </div>
              </div>

              <Separator className="mb-4" />

              {/* Order Summary */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">
                    {formatPrice(cart.subtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? "Free" : formatPrice(shipping)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-medium">{formatPrice(tax)}</span>
                </div>

                {cart.subtotal > 500 && (
                  <div className="flex items-center text-sm text-green-600">
                    <Truck className="h-3 w-3 mr-1" />
                    <span>You qualified for free shipping!</span>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold text-lg">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-2 mb-4 text-xs text-center">
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

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button
                  onClick={handleCheckout}
                  className="w-full"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <span className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Checkout
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </span>
                  )}
                </Button>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                  >
                    Continue Shopping
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={handleClearCart}
                    className="px-3"
                  >
                    Clear
                  </Button>
                </div>
              </div>

              {/* Security Note */}
              <div className="text-center text-xs text-muted-foreground mt-4">
                <div className="flex items-center justify-center space-x-2">
                  <Shield className="h-3 w-3" />
                  <span>Secure checkout powered by SSL encryption</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
