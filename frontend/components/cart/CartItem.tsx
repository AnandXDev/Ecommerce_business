"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Trash2, Plus, Minus, Heart, X, Package } from "lucide-react";
import { useCart } from "@/hooks/useCart";

// Local utility functions to avoid import issues
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(price);
};

const calculateItemTotal = (item: any) => {
  return item.price * item.quantity;
};

const calculateSavings = (item: any) => {
  if (!item.comparePrice || item.comparePrice <= item.price) {
    return 0;
  }
  return (item.comparePrice - item.price) * item.quantity;
};

interface CartItemProps {
  item: {
    id: string;
    productId: string;
    slug: string;
    name: string;
    images: Array<{ url: string; alt: string }>;
    price: number;
    comparePrice?: number;
    variant?: {
      id: string;
      name: string;
      options: Record<string, string>;
    };
    quantity: number;
    addedAt: string;
  };
  showRemoveButton?: boolean;
  className?: string;
}

export function CartItem({
  item,
  showRemoveButton = true,
  className = "",
}: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const [quantity, setQuantity] = useState(item.quantity);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > 99) return;

    setIsUpdating(true);
    try {
      await updateQuantity(item.id, newQuantity);
      setQuantity(newQuantity);
    } catch (error) {
      // Revert quantity on error
      setQuantity(item.quantity);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = () => {
    removeItem(item.id);
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // Wishlist logic here
  };

  const itemTotal = calculateItemTotal(item);
  const savings = calculateSavings(item);

  return (
    <div
      className={`flex items-start space-x-4 p-4 bg-background rounded-lg border ${className}`}
    >
      {/* Product Image */}
      <div className="relative flex-shrink-0">
        <div className="w-16 h-16 bg-gray-50 rounded overflow-hidden relative">
          {" "}
          {/* added relative */}
          {item.images?.length > 0 && (
            <Image
              src={item.images[0].url}
              alt={item.images[0].alt || item.name}
              fill // Added fill
              className="object-cover"
              sizes="64px"
            />
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute -top-2 -right-2 flex space-x-1">
          <button
            onClick={handleWishlist}
            className={`p-1 rounded-full bg-background border shadow-sm hover:bg-accent transition-colors ${
              isWishlisted
                ? "text-red-500 border-red-500"
                : "text-muted-foreground"
            }`}
            aria-label={
              isWishlisted ? "Remove from wishlist" : "Add to wishlist"
            }
          >
            <Heart
              className={`h-3 w-3 ${isWishlisted ? "fill-current" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        {/* Product Name and Variant */}
        <div className="mb-2">
          <h3 className="font-medium text-foreground line-clamp-2 hover:text-primary transition-colors">
            {item.name}
          </h3>

          {item.variant && (
            <div className="text-sm text-muted-foreground">
              {item.variant.name}:{" "}
              {Object.values(item.variant.options).join(", ")}
            </div>
          )}
        </div>

        {/* Price and Savings */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-foreground">
              {formatPrice(item.price)}
            </span>

            {item.comparePrice && item.comparePrice > item.price && (
              <>
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(item.comparePrice)}
                </span>
                <Badge variant="destructive" className="text-xs">
                  Save{" "}
                  {Math.round(
                    ((item.comparePrice - item.price) / item.comparePrice) *
                      100,
                  )}
                  %
                </Badge>
              </>
            )}
          </div>

          <div className="text-right">
            <div className="font-semibold text-foreground">
              {formatPrice(itemTotal)}
            </div>
            {savings > 0 && (
              <div className="text-xs text-green-600">
                You saved {formatPrice(savings)}
              </div>
            )}
          </div>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Quantity:</span>
            <div className="flex items-center border rounded-md">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1 || isUpdating}
                className="p-1 hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Decrease quantity"
              >
                <Minus className="h-3 w-3" />
              </button>

              <Input
                type="number"
                value={quantity}
                onChange={(e) => {
                  const newQuantity = parseInt(e.target.value) || 1;
                  if (newQuantity >= 1 && newQuantity <= 99) {
                    setQuantity(newQuantity);
                  }
                }}
                onBlur={() => {
                  if (quantity !== item.quantity) {
                    handleQuantityChange(quantity);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (quantity !== item.quantity) {
                      handleQuantityChange(quantity);
                    }
                  }
                }}
                className="w-16 text-center border-0 rounded-none focus:ring-0"
                min={1}
                max={99}
                disabled={isUpdating}
              />

              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= 99 || isUpdating}
                className="p-1 hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Increase quantity"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>

            {isUpdating && (
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            )}
          </div>

          {/* Remove Button */}
          {showRemoveButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Stock Status */}
        <div className="mt-2 flex items-center space-x-2">
          <Package className="h-3 w-3 text-green-600" />
          <span className="text-xs text-green-600">In Stock</span>
        </div>
      </div>
    </div>
  );
}

// Cart Item for Sidebar (Compact Version)
export function CartItemCompact({
  item,
  className = "",
}: Omit<CartItemProps, "showRemoveButton">) {
  const { updateQuantity, removeItem } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > 99) return;

    setIsUpdating(true);
    try {
      await updateQuantity(item.id, newQuantity);
    } catch (error) {
      // Error handling
    } finally {
      setIsUpdating(false);
    }
  };

  const itemTotal = calculateItemTotal(item);

  return (
    <div
      className={`flex items-center space-x-3 p-3 hover:bg-accent/50 rounded-lg transition-colors ${className}`}
    >
      {/* Product Image */}
      <div className="flex-shrink-0">
        <div className="w-16 h-16 bg-gray-50 rounded overflow-hidden">
          // The ?. prevents the crash if images is undefined
          {item.images?.length > 0 && (
            <Image
              src={item.images[0].url}
              alt={item.images[0].alt || item.name}
              // ... rest of your props
            />
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm text-foreground line-clamp-1">
          {item.name}
        </h4>

        {item.variant && (
          <div className="text-xs text-muted-foreground">
            {item.variant.name}
          </div>
        )}

        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center space-x-1">
            <span className="font-semibold text-sm">
              {formatPrice(item.price)}
            </span>
            <span className="text-xs text-muted-foreground">
              x{item.quantity}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="font-semibold text-sm">
              {formatPrice(itemTotal)}
            </span>
            <button
              onClick={() => removeItem(item.id)}
              className="text-muted-foreground hover:text-destructive transition-colors"
              aria-label="Remove item"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
