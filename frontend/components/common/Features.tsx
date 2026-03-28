"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { 
  Truck, 
  Shield, 
  RefreshCw, 
  Headphones, 
  Package, 
  Award 
} from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: Truck,
      title: 'Free Express Shipping',
      description: 'Free shipping on all orders. Express delivery to your doorstep within 3-5 business days.',
      color: 'text-blue-600'
    },
    {
      icon: Shield,
      title: 'Secure Shopping',
      description: 'Your payment information is protected with bank-level SSL encryption.',
      color: 'text-green-600'
    },
    {
      icon: RefreshCw,
      title: 'Easy Returns',
      description: '30-day hassle-free return policy. Full refund if not satisfied.',
      color: 'text-purple-600'
    },
    {
      icon: Headphones,
      title: '24/7 Customer Support',
      description: 'Our dedicated support team is here to help you anytime.',
      color: 'text-orange-600'
    },
    {
      icon: Package,
      title: 'Premium Quality',
      description: 'All products are carefully selected and quality-checked for your complete satisfaction.',
      color: 'text-red-600'
    },
    {
      icon: Award,
      title: 'Best Price Guarantee',
      description: 'We match any lower price on identical products within 30 days.',
      color: 'text-indigo-600'
    }
  ];

  return (
    <section className="py-20 bg-muted/50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose LuxeCart?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We provide the best shopping experience with premium features and exceptional service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center card-hover border-0 shadow-soft">
              <CardHeader className="pb-4">
                <div className={`w-16 h-16 mx-auto bg-background rounded-full flex items-center justify-center mb-4 ${feature.color}`}>
                  <feature.icon className="h-8 w-8" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-8 bg-background rounded-lg p-6 shadow-soft">
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">✓</span>
              </div>
              <div className="text-left">
                <div className="font-semibold">SSL Secured</div>
                <div className="text-sm text-muted-foreground">Safe Shopping</div>
              </div>
            </div>
            
            <div className="w-px h-12 bg-border"></div>
            
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">🔒</span>
              </div>
              <div className="text-left">
                <div className="font-semibold">Privacy Protected</div>
                <div className="text-sm text-muted-foreground">Your Data Safe</div>
              </div>
            </div>
            
            <div className="w-px h-12 bg-border"></div>
            
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold">🏆</span>
              </div>
              <div className="text-left">
                <div className="font-semibold">Award Winning</div>
                <div className="text-sm text-muted-foreground">Best Service 2024</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
