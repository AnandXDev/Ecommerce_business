"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useCheckout } from '@/hooks/useCheckout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Separator } from '@/components/ui/Separator';
import { Badge } from '@/components/ui/Badge';
import { 
  ArrowLeft,
  ShoppingBag,
  Package,
  Truck,
  CreditCard,
  Check,
  AlertCircle,
  Lock
} from 'lucide-react';
import { formatPrice } from '@/hooks/useCart';
import { CheckoutSteps } from '@/components/checkout/CheckoutSteps';
import { ShippingForm } from '@/components/checkout/ShippingForm';

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { cart } = useCart();
  const {
    currentStep,
    formData,
    updateFormData,
    nextStep,
    prevStep,
    goToStep,
    validateCurrentStep,
    calculateOrderTotals,
    processOrder,
    resetCheckout,
    clearError,
    canProceedToCheckout,
    shippingOptions,
    paymentMethods,
    isProcessing,
    error,
    completed,
    order
  } = useCheckout();

  const [isLoading, setIsLoading] = useState(false);

  // Redirect if cart is empty
  useEffect(() => {
    if (!canProceedToCheckout()) {
      router.push('/shop/cart');
    }
  }, [canProceedToCheckout, router]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/shop/checkout');
    }
  }, [isAuthenticated, router]);

  const handleStepSubmit = async () => {
    if (!validateCurrentStep()) {
      return;
    }

    if (currentStep === 4) {
      // Process order
      try {
        setIsLoading(true);
        await processOrder();
      } catch (error) {
        console.error('Order processing failed:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      nextStep();
    }
  };

  const totals = calculateOrderTotals();

  if (!canProceedToCheckout()) {
    return (
      <div className="container-custom py-16">
        <div className="text-center">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Your cart is empty
          </h2>
          <p className="text-muted-foreground mb-6">
            Add some items to your cart before proceeding to checkout
          </p>
          <Button onClick={() => router.push('/shop/products')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  if (completed && order) {
    return (
      <div className="container-custom py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Order Confirmed!
          </h1>
          
          <p className="text-lg text-muted-foreground mb-6">
            Thank you for your order. We've sent a confirmation email to {formData.email}.
          </p>
          
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="text-left space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Number:</span>
                  <span className="font-mono font-semibold">{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Total:</span>
                  <span className="font-semibold">{formatPrice(totals.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated Delivery:</span>
                  <span className="font-semibold">
                    {shippingOptions.find(opt => opt.id === formData.shippingMethod)?.estimatedDays}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex space-x-4 justify-center">
            <Button
              variant="outline"
              onClick={() => router.push('/shop/products')}
            >
              Continue Shopping
            </Button>
            <Button onClick={() => router.push('/account/orders')}>
              View Order Details
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/shop/cart')}
            className="text-muted-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <h1 className="text-2xl font-bold text-foreground">Checkout</h1>
        </div>
        
        <Badge variant="secondary">
          {cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'}
        </Badge>
      </div>

      {/* Checkout Steps */}
      <CheckoutSteps
        currentStep={currentStep}
        completed={completed}
        onStepClick={goToStep}
      />

      <div className="grid lg:grid-cols-3 gap-8 mt-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {currentStep === 1 && <ShippingForm />}
          
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Truck className="h-5 w-5" />
                  <span>Shipping Method</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {shippingOptions.map((option) => (
                    <div
                      key={option.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        formData.shippingMethod === option.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => updateFormData({ shippingMethod: option.id as any })}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium">{option.name}</h3>
                            {option.isRecommended && (
                              <Badge variant="secondary" className="text-xs">
                                Recommended
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {option.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            {option.price === 0 ? 'Free' : formatPrice(option.price)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {option.estimatedDays}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 flex space-x-4">
                  <Button variant="outline" onClick={prevStep} className="flex-1">
                    Back
                  </Button>
                  <Button onClick={handleStepSubmit} className="flex-1">
                    Continue to Payment
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Payment Method</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Payment Methods */}
                  <div className="space-y-4">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          formData.paymentMethod === method.type
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => updateFormData({ paymentMethod: method.type as any })}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-xs font-medium">{method.name.split(' ')[0]}</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{method.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {method.description}
                            </p>
                          </div>
                          {method.isRecommended && (
                            <Badge variant="secondary" className="text-xs">
                              Recommended
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Terms and Newsletter */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={formData.agreeToTerms}
                        onChange={(e) => updateFormData({ agreeToTerms: e.target.checked })}
                        className="rounded border-gray-300"
                      />
                      <label htmlFor="terms" className="text-sm text-muted-foreground">
                        I agree to the Terms and Conditions and Privacy Policy
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="newsletter"
                        checked={formData.subscribeNewsletter}
                        onChange={(e) => updateFormData({ subscribeNewsletter: e.target.checked })}
                        className="rounded border-gray-300"
                      />
                      <label htmlFor="newsletter" className="text-sm text-muted-foreground">
                        Subscribe to our newsletter for exclusive offers
                      </label>
                    </div>
                  </div>

                  {/* Security Note */}
                  <div className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <Lock className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-green-700 dark:text-green-300">
                      Your payment information is secure and encrypted
                    </span>
                  </div>
                  
                  <div className="flex space-x-4">
                    <Button variant="outline" onClick={prevStep} className="flex-1">
                      Back
                    </Button>
                    <Button onClick={handleStepSubmit} className="flex-1">
                      Review Order
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {currentStep === 4 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Check className="h-5 w-5" />
                  <span>Review Order</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Order Items */}
                  <div>
                    <h3 className="font-medium mb-4">Order Items</h3>
                    <div className="space-y-3">
                      {cart.items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gray-100 rounded"></div>
                          <div className="flex-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Qty: {item.quantity} × {formatPrice(item.price)}
                            </p>
                          </div>
                          <div className="font-semibold">
                            {formatPrice(item.price * item.quantity)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Shipping Address */}
                  <div>
                    <h3 className="font-medium mb-2">Shipping Address</h3>
                    <div className="text-sm text-muted-foreground">
                      <p>{formData.firstName} {formData.lastName}</p>
                      <p>{formData.address.street}</p>
                      <p>
                        {formData.address.city}, {formData.address.state} {formData.address.zipCode}
                      </p>
                      <p>{formData.address.country}</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Order Total */}
                  <div>
                    <h3 className="font-medium mb-4">Order Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>{formatPrice(totals.subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>
                          {totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax</span>
                        <span>{formatPrice(totals.tax)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>{formatPrice(totals.total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                      <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
                    </div>
                  )}

                  <div className="flex space-x-4">
                    <Button variant="outline" onClick={prevStep} className="flex-1">
                      Back
                    </Button>
                    <Button
                      onClick={handleStepSubmit}
                      className="flex-1"
                      disabled={isProcessing || isLoading}
                      isLoading={isProcessing || isLoading}
                    >
                      {isProcessing || isLoading ? 'Processing...' : 'Place Order'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Items Count */}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'}
                  </span>
                  <span>{formatPrice(totals.subtotal)}</span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>
                    {totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping)}
                  </span>
                </div>

                {/* Tax */}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>{formatPrice(totals.tax)}</span>
                </div>

                <Separator />

                {/* Total */}
                <div className="flex justify-between">
                  <span className="font-semibold text-lg">Total</span>
                  <span className="font-semibold text-lg">{formatPrice(totals.total)}</span>
                </div>

                {/* Promo Code */}
                <div className="pt-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Promo code"
                      className="flex-1 px-3 py-2 border rounded-md text-sm"
                    />
                    <Button variant="outline" size="sm">
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
