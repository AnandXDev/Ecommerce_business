"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { 
  CheckCircle, 
  Package, 
  Truck, 
  Mail,
  ArrowRight,
  Home,
  ShoppingBag
} from 'lucide-react';

export default function OrderSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home if accessed directly without order completion
    const timer = setTimeout(() => {
      // You could check for order ID in URL params or localStorage
    }, 100);

    return () => clearTimeout(timer);
  }, []);

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

  const iconVariants = {
    hidden: { 
      scale: 0,
      rotate: -180
    },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.2
      }
    }
  };

  const contentVariants = {
    hidden: { 
      opacity: 0, 
      y: 50 
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.4
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center px-4"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        variants={contentVariants}
        className="relative w-full max-w-2xl"
      >
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8 md:p-12">
          {/* Success Icon */}
          <motion.div
            variants={iconVariants}
            className="mx-auto w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-8"
          >
            <CheckCircle className="w-12 h-12 text-white" />
          </motion.div>

          {/* Success Message */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Order Placed Successfully!
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              Thank you for your purchase. Your order has been confirmed.
            </p>
            <p className="text-gray-600">
              You will receive an order confirmation email shortly.
            </p>
          </div>

          {/* Order Info Card */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Package className="h-8 w-8 text-green-600" />
                <div>
                  <p className="font-semibold text-gray-900">Order #ORD{Date.now()}</p>
                  <p className="text-sm text-gray-600">Estimated delivery: 5-7 business days</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-semibold text-green-600">Processing</p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">What happens next?</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Mail className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Order Confirmation</p>
                  <p className="text-sm text-gray-600">Check your email for order details and tracking information</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Package className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Order Processing</p>
                  <p className="text-sm text-gray-600">We'll prepare your items for shipping within 1-2 business days</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Truck className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Out for Delivery</p>
                  <p className="text-sm text-gray-600">Your order will be delivered within 5-7 business days</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={() => router.push('/')}
              variant="outline"
              size="lg"
              className="w-full"
            >
              <Home className="h-5 w-5 mr-2" />
              Back to Home
            </Button>
            
            <Button
              onClick={() => router.push('/products')}
              size="lg"
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              Continue Shopping
            </Button>
          </div>

          {/* Customer Support */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 mb-2">
              Need help with your order?
            </p>
            <Link 
              href="/contact" 
              className="text-primary hover:text-primary/80 font-medium text-sm inline-flex items-center"
            >
              Contact Customer Support
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          {/* Order Details Link */}
          <div className="mt-6 text-center">
            <Link 
              href="/account/orders" 
              className="text-gray-600 hover:text-gray-900 text-sm underline"
            >
              View Order Details
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
