"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ArrowRight, Play, Star } from "lucide-react";
import Link from "next/link";
import RotatingText from "./RotatingText";
import { url } from "inspector";

interface HeroBannerProps {
  title?: string;
  subtitle?: string;
  description?: string;
  primaryAction?: { text: string; href: string };
  secondaryAction?: { text: string; href: string };
  badge?: string;
  backgroundImage?: string;
}

export function HeroBanner({
  title = "Shop Premium Quality Products",
  subtitle = "Amazing Deals",
  description = "Discover incredible products at unbeatable prices. Fast shipping, secure checkout, and 30-day satisfaction guarantee.",
  primaryAction = { text: "Start Shopping", href: "/products" },
  secondaryAction = { text: "View Deals", href: "/products?onSale=true" },
  badge = "Limited Time Offer",
  backgroundImage,
}: HeroBannerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      title: "Mega Sale Event",
      subtitle: "Up to 50% Off",
      description:
        "Don't miss out on our biggest sale of the year. Premium products at unbeatable prices.",
      badge: "Flash Sale",
      gradient: "from-orange-500/20 to-red-500/20",
    },
    {
      title: "New Arrivals",
      subtitle: "Just In Store",
      description:
        "Check out the latest products added to our collection. Fresh styles and innovative gadgets.",
      badge: "New",
      gradient: "from-blue-500/20 to-purple-500/20",
    },
    {
      title: "Free Express Shipping",
      subtitle: "On All Orders",
      description:
        "Enjoy fast delivery on all orders. Get your products within 3-5 business days.",
      badge: "Free Shipping",
      gradient: "from-green-500/20 to-emerald-500/20",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const currentSlideData = slides[currentSlide];
  const slides1 = [
    {
      id: 1,
      title: "Summer Collection",
      subtitle: "Up to 50% Off",
      image:
        "https://storage.googleapis.com/bitr-cdn/wp-content/uploads/2024/06/asics-superblast-2-feature.jpg",
      gradient: "from-orange-500/40 to-transparent",
    },
    {
      id: 2,
      title: "Premium Tech",
      subtitle: "The Future is Here",
      image:
        "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6462/6462658ld.jpg",
      gradient: "from-blue-600/40 to-transparent",
    },
    {
      id: 3,
      title: "Urban Style",
      subtitle: "Streetwear Essentials",
      image: "https://i.ytimg.com/vi/8nBuO4bX52U/maxresdefault.jpg",
      gradient: "from-purple-600/40 to-transparent",
    },
    {
      id: 4,
      title: "Home Decor",
      subtitle: "Minimalist Living",
      image:
        "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=2067",
      gradient: "from-emerald-600/40 to-transparent",
    },
  ];

  // Optional: Auto-play effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const currentSlide1 = slides1[currentIndex];
  return (
    <section className="relative overflow-hidden h-2/5">
      {/* Background with gradient */}
      {/* <div className={`absolute inset-0 bg-gradient-to-br ${currentSlideData.gradient} transition-all duration-1000`} /> */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
        style={{ backgroundImage: `url('${currentSlide1.image}')` }}
      />

      {/* Gradient Overlay Layer */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${currentSlide1.gradient} transition-all duration-1000`}
      />

      {/* Content Layer */}

      {/* Navigation Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 w-2 rounded-full transition-all ${
              index === currentIndex ? "bg-white w-6" : "bg-white/50"
            }`}
          />
        ))}
      </div>
      <div className="relative container-custom py-12 lg:py-20">
        <div className="grid lg:grid-cols-1 gap-12 text-center items-center ">
          {/* Left Content */}
          <div className="space-y-6 lg:space-y-8 rounded-lg p-6  ">
            {/* Badge */}
            <Badge
              variant="secondary"
              className="inline-flex items-center space-x-2 animate-pulse"
            >
              <Star className="h-4 w-4 fill-current" />
              <span>{currentSlideData.badge}</span>
            </Badge>

            {/* Title with Gradient Text */}
            <div className="space-y-2">
              <h1 className="text-4xl text-center md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="block bg-gradient-to-r from-lime-400 to-emerald-500 bg-clip-text text-transparent animate-pulse">
                  {currentSlideData.title}
                </span>
                <span className="block text-primary mt-2">
                  {currentSlideData.subtitle}
                </span>
              </h1>
            </div>

            {/* Description */}
            <p className="text-lg mx-auto text-white text-muted-foreground max-w-2xl">
              {currentSlideData.description}
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
              {/* Primary Button */}
              <Button
                size="lg"
                asChild
                className="
    relative overflow-hidden
    bg-blue-400 backdrop-blur-md
    text-white
    text-lg
    border border-white/20
    min-w-[180px]
    px-20 py-8
    rounded-xl
    transition-all duration-500
    hover:bg-white/20
    hover:scale-105
    hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]
    group

  "
              >
                <Link
                  href={primaryAction.href}
                  className="flex items-center justify-center gap-2"
                >
                  <RotatingText
                    texts={["Start Shopping", "Explore Now", "Buy Now"]}
                    mainClassName="font-semibold"
                    staggerFrom="last"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-120%" }}
                    staggerDuration={0.03}
                    rotationInterval={2000}
                  />

                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />

                  {/* ✨ glow effect */}
                  <span className="absolute inset-0 bg-gradient-to-r from-lime-300/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />
                </Link>
              </Button>

              {/* Secondary Button */}
              {/* <Button
                variant="outline"
                size="lg"
                className="min-w-[160px] justify-center"
                asChild
              >
                <Link
                  href={secondaryAction.href}
                  className="inline-flex items-center space-x-2"
                >
                  <Play className="h-5 w-5" />
                  <span>{secondaryAction.text}</span>
                </Link>
              </Button> */}
            </div>
            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 pt-8 justify-center ">
              <div className="flex items-center space-x-2 group cursor-pointer transition-all duration-300 hover:scale-110">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 group-hover:shadow-[0_0_15px_rgba(34,197,94,0.4)] transition-all duration-300">
                  <svg
                    className="w-4 h-4 text-green-600 group-hover:animate-bounce"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-sm text-muted-foreground group-hover:text-green-600 transition-colors duration-300">
                  Secure Payment
                </span>
              </div>

              <div className="flex items-center space-x-2 group cursor-pointer transition-all duration-300 hover:scale-110">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all duration-300">
                  <svg
                    className="w-4 h-4 text-blue-600 group-hover:animate-bounce"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-6a1 1 0 00-1-1h-3z" />
                  </svg>
                </div>
                <span className="text-sm text-muted-foreground group-hover:text-blue-600 transition-colors duration-300">
                  Fast Delivery
                </span>
              </div>

              <div className="flex items-center space-x-2 group cursor-pointer transition-all duration-300 hover:scale-110">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 group-hover:shadow-[0_0_15px_rgba(147,51,234,0.4)] transition-all duration-300">
                  <svg
                    className="w-4 h-4 text-purple-600 group-hover:animate-bounce"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-sm text-muted-foreground group-hover:text-purple-600 transition-colors duration-300">
                  24/7 Support
                </span>
              </div>
            </div>
          </div>

          {/* Right Side - Placeholder for trending products or image */}
        </div>
      </div>
    </section>
  );
}
