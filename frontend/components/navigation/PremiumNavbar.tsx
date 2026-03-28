"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  Heart, 
  Package,
  ChevronDown,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  cartCount?: number;
  isAuthenticated?: boolean;
}

export function PremiumNavbar({ cartCount = 0, isAuthenticated = false }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navbarClasses = `
    fixed top-0 left-0 right-0 z-50 transition-all duration-300
    ${isScrolled 
      ? "bg-white/90 backdrop-blur-lg shadow-lg border-b border-gray-100" 
      : "bg-white/80 backdrop-blur-md border-b border-gray-50"
    }
  `;

  return (
    <nav className={navbarClasses}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
              ShopHub
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
            <div className={`relative w-full transition-all duration-300 ${isSearchFocused ? "scale-105" : ""}`}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className={`h-5 w-5 transition-colors ${isSearchFocused ? "text-primary-500" : "text-gray-400"}`} />
              </div>
              <Input
                type="text"
                placeholder="Search for products, brands, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="pl-10 pr-4 h-12 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
              {searchQuery && (
                <Button
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-10 px-4 bg-primary-500 hover:bg-primary-600"
                >
                  Search
                </Button>
              )}
            </div>
          </div>

          {/* Navigation Items - Desktop */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Categories Dropdown */}
            <div className="relative group">
              <Button variant="ghost" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600">
                <span>Categories</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
              {/* Dropdown Menu */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
              >
                <div className="p-4 space-y-2">
                  <Link href="/categories/electronics" className="block px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-primary-600 transition-colors">
                    Electronics
                  </Link>
                  <Link href="/categories/fashion" className="block px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-primary-600 transition-colors">
                    Fashion
                  </Link>
                  <Link href="/categories/home" className="block px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-primary-600 transition-colors">
                    Home & Living
                  </Link>
                  <Link href="/categories/sports" className="block px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-primary-600 transition-colors">
                    Sports
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Deals */}
            <Link href="/deals" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors">
              <Sparkles className="h-4 w-4" />
              <span>Deals</span>
            </Link>

            {/* Wishlist */}
            <Link href="/wishlist" className="relative group">
              <div className="p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <Heart className="h-5 w-5 text-gray-700 group-hover:text-red-500 transition-colors" />
              </div>
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative group">
              <div className="p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <ShoppingCart className="h-5 w-5 text-gray-700 group-hover:text-primary-600 transition-colors" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-primary-500 text-white text-xs rounded-full">
                    {cartCount > 99 ? "99+" : cartCount}
                  </Badge>
                )}
              </div>
            </Link>

            {/* Account */}
            {isAuthenticated ? (
              <div className="relative group">
                <Button variant="ghost" className="flex items-center space-x-2 text-gray-700 hover:text-primary-600">
                  <User className="h-5 w-5" />
                  <span>Account</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
                {/* Account Dropdown */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                >
                  <div className="p-4 space-y-2">
                    <Link href="/account/profile" className="block px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-primary-600 transition-colors">
                      Profile
                    </Link>
                    <Link href="/account/orders" className="block px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-primary-600 transition-colors">
                      Orders
                    </Link>
                    <Link href="/account/wishlist" className="block px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-primary-600 transition-colors">
                      Wishlist
                    </Link>
                    <hr className="my-2" />
                    <Link href="/logout" className="block px-3 py-2 rounded-lg hover:bg-gray-50 text-red-600 hover:text-red-600 transition-colors">
                      Logout
                    </Link>
                  </div>
                </motion.div>
              </div>
            ) : (
              <Link href="/login">
                <Button variant="outline" className="border-primary-500 text-primary-600 hover:bg-primary-50">
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-gray-100"
            >
              <div className="py-4 space-y-4">
                {/* Mobile Search */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 h-12 bg-gray-50 border-gray-200 rounded-xl"
                  />
                </div>

                {/* Mobile Navigation */}
                <div className="space-y-2">
                  <Link href="/categories" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                    Categories
                  </Link>
                  <Link href="/deals" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                    Deals
                  </Link>
                  <Link href="/wishlist" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                    Wishlist
                  </Link>
                  <Link href="/cart" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                    Cart {cartCount > 0 && `(${cartCount})`}
                  </Link>
                  {isAuthenticated ? (
                    <>
                      <Link href="/account" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                        Account
                      </Link>
                      <Link href="/logout" className="block px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        Logout
                      </Link>
                    </>
                  ) : (
                    <Link href="/login">
                      <Button className="w-full bg-primary-500 hover:bg-primary-600">
                        Sign In
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
