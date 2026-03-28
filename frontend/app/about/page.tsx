"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Truck, 
  Shield, 
  Heart, 
  Users, 
  Award,
  Globe,
  Package,
  Headphones
} from 'lucide-react';

export default function AboutPage() {
  const [stats, setStats] = useState({
    customers: 0,
    products: 0,
    countries: 0,
    satisfaction: 0
  });

  useEffect(() => {
    // Animate stats on mount
    const timer = setTimeout(() => {
      setStats({
        customers: 50000,
        products: 5000,
        countries: 25,
        satisfaction: 98
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const values = [
    {
      icon: Heart,
      title: "Customer First",
      description: "We prioritize your satisfaction above everything else. Your happiness is our success."
    },
    {
      icon: Shield,
      title: "Trust & Security",
      description: "Your data and transactions are protected with bank-level security and encryption."
    },
    {
      icon: Package,
      title: "Quality Products",
      description: "Every product is carefully selected and quality-checked to ensure your satisfaction."
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "We ship worldwide, bringing quality products to customers across the globe."
    }
  ];

  const features = [
    {
      icon: Truck,
      title: "Free Express Shipping",
      description: "Enjoy free shipping on all orders with express delivery within 3-5 business days."
    },
    {
      icon: Award,
      title: "Best Price Guarantee",
      description: "We match any lower price on identical products within 30 days of purchase."
    },
    {
      icon: Headphones,
      title: "24/7 Customer Support",
      description: "Our dedicated support team is here to help you anytime, anywhere."
    },
    {
      icon: Shield,
      title: "Secure Shopping",
      description: "Shop with confidence knowing your payment information is always protected."
    },
    {
      icon: Package,
      title: "Easy Returns",
      description: "30-day hassle-free return policy. Full refund if you're not completely satisfied."
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Join thousands of happy customers who trust LuxeCart for their shopping needs."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6">
              About LuxeCart
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Your Trusted
              <span className="text-primary block"> Shopping Partner</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              We're on a mission to make quality products accessible to everyone, 
              anywhere in the world. Shop with confidence and enjoy the best online shopping experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="/products">Start Shopping</a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="/contact">Contact Us</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: "Happy Customers", value: stats.customers, suffix: "+" },
              { label: "Products", value: stats.products, suffix: "+" },
              { label: "Countries", value: stats.countries, suffix: "+" },
              { label: "Satisfaction", value: stats.satisfaction, suffix: "%" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                  {stat.value.toLocaleString()}{stat.suffix}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Badge variant="outline">Our Mission</Badge>
                <h2 className="text-3xl font-bold text-foreground">
                  Making Quality Shopping Accessible
                </h2>
                <p className="text-lg text-muted-foreground">
                  At LuxeCart, we believe everyone deserves access to quality products at fair prices. 
                  We work tirelessly to curate the best selection of items, ensure secure transactions, 
                  and provide exceptional customer service that makes shopping a joy.
                </p>
                <p className="text-lg text-muted-foreground">
                  Our platform connects you with trusted suppliers and ensures every purchase 
                  meets our high standards for quality and value.
                </p>
              </div>
              <div className="space-y-6">
                <Badge variant="outline">Our Vision</Badge>
                <h2 className="text-3xl font-bold text-foreground">
                  The Future of Online Shopping
                </h2>
                <p className="text-lg text-muted-foreground">
                  We envision a world where shopping is seamless, secure, and sustainable. 
                  By leveraging technology and building strong relationships with our customers, 
                  we're creating the ultimate shopping experience.
                </p>
                <p className="text-lg text-muted-foreground">
                  Our goal is to become the most trusted online shopping destination, 
                  known for quality, reliability, and exceptional service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-lg bg-card hover:shadow-lg transition-shadow animate-fadeIn"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Why Choose LuxeCart
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the difference with our premium features and exceptional service
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex gap-4 p-6 rounded-lg bg-card hover:shadow-lg transition-all hover:scale-105 animate-fadeIn"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/80">
        <div className="container-custom">
          <div className="text-center text-white max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Ready to Start Shopping?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Join thousands of happy customers and discover amazing products at great prices.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <a href="/products">Browse Products</a>
            </Button>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
