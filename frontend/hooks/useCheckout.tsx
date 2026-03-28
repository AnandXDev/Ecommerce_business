'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useCart } from './useCart';

// Types
export interface CheckoutFormData {
  // Shipping Information
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  
  // Shipping Method
  shippingMethod: 'standard' | 'express' | 'overnight';
  
  // Billing Information
  billingAddress: {
    sameAsShipping: boolean;
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  
  // Payment Information
  paymentMethod: 'card' | 'paypal' | 'apple-pay' | 'google-pay';
  cardDetails?: {
    number: string;
    expiry: string;
    cvv: string;
    name: string;
    saveCard: boolean;
  };
  
  // Order Notes
  orderNotes?: string;
  
  // Terms
  agreeToTerms: boolean;
  subscribeNewsletter: boolean;
}

export interface ShippingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
  isRecommended?: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'apple-pay' | 'google-pay';
  name: string;
  icon: string;
  description?: string;
  isRecommended?: boolean;
}

export interface CheckoutState {
  currentStep: number;
  formData: CheckoutFormData;
  isProcessing: boolean;
  error: string | null;
  order: any | null;
  completed: boolean;
}

const CHECKOUT_STORAGE_KEY = 'dropship_checkout';

const initialFormData: CheckoutFormData = {
  email: '',
  firstName: '',
  lastName: '',
  phone: '',
  address: {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  },
  shippingMethod: 'standard',
  billingAddress: {
    sameAsShipping: true
  },
  paymentMethod: 'card',
  cardDetails: {
    number: '',
    expiry: '',
    cvv: '',
    name: '',
    saveCard: false
  },
  orderNotes: '',
  agreeToTerms: false,
  subscribeNewsletter: false
};

export const shippingOptions: ShippingOption[] = [
  {
    id: 'standard',
    name: 'Standard Shipping',
    description: '5-7 business days',
    price: 9.99,
    estimatedDays: '5-7 days'
  },
  {
    id: 'express',
    name: 'Express Shipping',
    description: '2-3 business days',
    price: 19.99,
    estimatedDays: '2-3 days',
    isRecommended: true
  },
  {
    id: 'overnight',
    name: 'Overnight Shipping',
    description: 'Next business day',
    price: 39.99,
    estimatedDays: '1 day'
  }
];

export const paymentMethods: PaymentMethod[] = [
  {
    id: 'card',
    type: 'card',
    name: 'Credit/Debit Card',
    icon: 'credit-card',
    description: 'Visa, Mastercard, American Express',
    isRecommended: true
  },
  {
    id: 'paypal',
    type: 'paypal',
    name: 'PayPal',
    icon: 'paypal',
    description: 'Pay with your PayPal account'
  },
  {
    id: 'apple-pay',
    type: 'apple-pay',
    name: 'Apple Pay',
    icon: 'apple-pay',
    description: 'Pay with Apple Pay'
  },
  {
    id: 'google-pay',
    type: 'google-pay',
    name: 'Google Pay',
    icon: 'google-pay',
    description: 'Pay with Google Pay'
  }
];

export function useCheckout() {
  const { user, isAuthenticated } = useAuth();
  const { cart } = useCart();
  
  const [checkoutState, setCheckoutState] = useState<CheckoutState>({
    currentStep: 1,
    formData: initialFormData,
    isProcessing: false,
    error: null,
    order: null,
    completed: false
  });

  // Load saved checkout data from localStorage
  useEffect(() => {
    try {
      const savedCheckout = localStorage.getItem(CHECKOUT_STORAGE_KEY);
      if (savedCheckout) {
        const parsed = JSON.parse(savedCheckout);
        setCheckoutState(prev => ({
          ...prev,
          formData: { ...initialFormData, ...parsed.formData }
        }));
      }
    } catch (error) {
      console.error('Error loading checkout data:', error);
    }
  }, []);

  // Save checkout data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify({
        formData: checkoutState.formData,
        currentStep: checkoutState.currentStep
      }));
    } catch (error) {
      console.error('Error saving checkout data:', error);
    }
  }, [checkoutState.formData, checkoutState.currentStep]);

  // Pre-fill user data when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setCheckoutState(prev => ({
        ...prev,
        formData: {
          ...prev.formData,
          email: user.email || checkoutState.formData.email,
          firstName: user.firstName || checkoutState.formData.firstName,
          lastName: user.lastName || checkoutState.formData.lastName,
          phone: user.phone || checkoutState.formData.phone,
          address: user.addresses?.[0] || checkoutState.formData.address
        }
      }));
    }
  }, [isAuthenticated, user]);

  // Validate if user can proceed to checkout
  const canProceedToCheckout = () => {
    return cart.items.length > 0;
  };

  // Update form data
  const updateFormData = (data: Partial<CheckoutFormData>) => {
    setCheckoutState(prev => ({
      ...prev,
      formData: { ...prev.formData, ...data }
    }));
  };

  // Navigate to next step
  const nextStep = () => {
    setCheckoutState(prev => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, 4)
    }));
  };

  // Navigate to previous step
  const prevStep = () => {
    setCheckoutState(prev => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 1)
    }));
  };

  // Go to specific step
  const goToStep = (step: number) => {
    setCheckoutState(prev => ({
      ...prev,
      currentStep: Math.max(1, Math.min(step, 4))
    }));
  };

  // Validate current step
  const validateCurrentStep = (): boolean => {
    const { formData, currentStep } = checkoutState;

    switch (currentStep) {
      case 1: // Shipping Information
        return !!(
          checkoutState.formData.email &&
          checkoutState.formData.firstName &&
          checkoutState.formData.lastName &&
          checkoutState.formData.phone &&
          checkoutState.formData.address.street &&
          checkoutState.formData.address.city &&
          checkoutState.formData.address.state &&
          checkoutState.formData.address.zipCode &&
          checkoutState.formData.address.country
        );

      case 2: // Shipping Method
        return !!checkoutState.formData.shippingMethod;

      case 3: // Payment
        return !!(
          checkoutState.formData.paymentMethod &&
          checkoutState.formData.agreeToTerms &&
          (checkoutState.formData.paymentMethod !== 'card' || (
            checkoutState.formData.cardDetails?.number &&
            checkoutState.formData.cardDetails?.expiry &&
            checkoutState.formData.cardDetails?.cvv &&
            checkoutState.formData.cardDetails?.name
          ))
        );

      case 4: // Review
        return true; // Review step doesn't need validation

      default:
        return false;
    }
  };

  // Calculate order totals
  const calculateOrderTotals = () => {
    const subtotal = cart.subtotal;
    const shippingOption = shippingOptions.find(option => option.id === checkoutState.formData.shippingMethod);
    const shippingCost = shippingOption ? shippingOption.price : 0;
    const tax = subtotal * 0.08; // 8% tax rate
    const total = subtotal + shippingCost + tax;

    return {
      subtotal,
      shipping: shippingCost,
      tax,
      total
    };
  };

  // Process order
  const processOrder = async () => {
    if (!validateCurrentStep()) {
      setCheckoutState(prev => ({
        ...prev,
        error: 'Please complete all required fields'
      }));
      return;
    }

    setCheckoutState(prev => ({
      ...prev,
      isProcessing: true,
      error: null
    }));

    try {
      // Create order payload
      const orderPayload = {
        items: cart.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          variant: item.variant
        })),
        shippingAddress: checkoutState.formData.address,
        billingAddress: checkoutState.formData.billingAddress.sameAsShipping 
          ? checkoutState.formData.address 
          : checkoutState.formData.billingAddress,
        shippingMethod: checkoutState.formData.shippingMethod,
        paymentMethod: checkoutState.formData.paymentMethod,
        orderNotes: checkoutState.formData.orderNotes,
        ...calculateOrderTotals()
      };

      // Mock API call - replace with actual payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock order creation
      const order = {
        id: `ORD-${Date.now()}`,
        status: 'processing',
        createdAt: new Date().toISOString(),
        ...orderPayload
      };

      setCheckoutState(prev => ({
        ...prev,
        order,
        completed: true,
        isProcessing: false
      }));

      // Clear checkout data and cart
      localStorage.removeItem(CHECKOUT_STORAGE_KEY);
      // cart.clearCart(); // This would be called after successful order

      return order;
    } catch (error) {
      setCheckoutState(prev => ({
        ...prev,
        isProcessing: false,
        error: 'Failed to process order. Please try again.'
      }));
      throw error;
    }
  };

  // Reset checkout
  const resetCheckout = () => {
    setCheckoutState({
      currentStep: 1,
      formData: initialFormData,
      isProcessing: false,
      error: null,
      order: null,
      completed: false
    });
    localStorage.removeItem(CHECKOUT_STORAGE_KEY);
  };

  // Clear error
  const clearError = () => {
    setCheckoutState(prev => ({
      ...prev,
      error: null
    }));
  };

  return {
    ...checkoutState,
    formData: checkoutState.formData,
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
    paymentMethods
  };
}
