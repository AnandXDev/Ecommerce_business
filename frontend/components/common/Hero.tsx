"use client";

import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ArrowRight, Play, Star } from 'lucide-react';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="inline-flex items-center space-x-2">
                <Star className="h-4 w-4 fill-current" />
                <span>Trusted by 50,000+ Happy Customers</span>
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Shop Premium
                <span className="text-primary"> Quality Products</span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-2xl">
                Discover amazing products at unbeatable prices. Fast worldwide shipping, 
                secure checkout, and 30-day satisfaction guarantee.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="inline-flex items-center space-x-2" asChild>
                <Link href="/products">
                  <span>Start Shopping</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" className="inline-flex items-center space-x-2">
                <Play className="h-5 w-5" />
                <span>View Products</span>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">50K+</div>
                <div className="text-sm text-muted-foreground">Products</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Support</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">30-Day</div>
                <div className="text-sm text-muted-foreground">Returns</div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="relative aspect-square lg:aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
              {/* Placeholder for hero image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-32 h-32 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                    <Play className="h-16 w-16 text-primary" />
                  </div>
                  <p className="text-muted-foreground">Hero Image Placeholder</p>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-lg p-3 shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Live Now</span>
                </div>
              </div>
              
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur rounded-lg p-4 shadow-lg">
                <div className="text-sm font-medium mb-1">Flash Sale!</div>
                <div className="text-2xl font-bold text-primary">50% OFF</div>
                <div className="text-xs text-muted-foreground">Limited time only</div>
              </div>
            </div>

            {/* Floating Cards */}
            <div className="absolute -top-8 -left-8 bg-white rounded-lg shadow-lg p-4 hidden lg:block">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">4.9/5 Rating</div>
                  <div className="text-sm text-muted-foreground">From 2,847 reviews</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-8 -right-8 bg-white rounded-lg shadow-lg p-4 hidden lg:block">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
                <div>
                  <div className="font-semibold">Free Shipping</div>
                  <div className="text-sm text-muted-foreground">On orders over $50</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
