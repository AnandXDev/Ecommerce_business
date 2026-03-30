"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SearchBar } from '../common/SearchBar';
import { CartSidebar } from '../cart/CartSidebar';
import { UserMenu } from './UserMenu';
import { MobileMenu } from './MobileMenu';
import { ShoppingCart, User, Menu, Search } from 'lucide-react';
import { CategoryRow } from '../CategoryRow';
import { LuAlignJustify } from "react-icons/lu";


 // Categories for navigation
  const categories = [
    {id: '1', name: `All `, slug: 'all', icon: <LuAlignJustify />, productCount: 500   },
    { id: '2', name: 'Electronics', slug: 'electronics', icon: '📱', productCount: 234 },
    { id: '3', name: 'Home & Kitchen', slug: 'home-kitchen', icon: '🏠', productCount: 156 },
    { id: '4', name: 'Fashion', slug: 'fashion', icon: '👔', productCount: 189 },
    { id: '5', name: 'Fitness', slug: 'fitness', icon: '💪', productCount: 98 },
    { id: '6', name: 'Beauty', slug: 'beauty', icon: '💄', productCount: 76 },
    { id: '7', name: 'Accessories', slug: 'accessories', icon: '⌚', productCount: 45 }
  ];
export function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const { cart } = useCart();
  const pathname = usePathname();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
  
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="  bg-gray-700 top-0 z-40 w-full border-b border-muted">
        <div className="mx-0">
          <div className="flex h-16 items-center justify-around">
            {/* Logo */}
            <div className="flex items-center mx-2">
              <Link href="/" className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">DS</span>
                </div>
                <span className="text-xl font-bold text-foreground">LuxeCart</span>
              </Link>
            </div>

          
            {/* Actions */}
            <div className="flex items-center space-x-4 flex-1 max-w-2xl mx-auto">
              {/* Search */}
              <div className="hidden md:block flex-1">
                <SearchBar className="w-full" />
              </div>
              <button
                onClick={() => setIsSearchOpen(true)}
                className="md:hidden p-2 rounded-md hover:bg-accent"
              >
                <Search className="h-6 w-6" />
              </button>

              {/* Cart */}
             

              {/* User Menu */}
             
            </div>
             <button
                onClick={() => window.location.href = '/cart'}
                className="relative p-2 rounded-md hover:bg-accent"
              >
                <ShoppingCart className="h-5 w-5" />
                {cart.itemCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {cart.itemCount}
                  </Badge>
                )}
              </button>
               {isAuthenticated ? (
                <UserMenu />
              ) : (
                <div className="hidden md:flex items-center space-x-2">
                  <Button variant="ghost" asChild>
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/register">Sign Up</Link>
                  </Button>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-md hover:bg-accent"
              >
                <Menu className="h-5 w-5" />
              </button>
              
              
          </div>
          <div>
              {/* Desktop Navigation */}
            {/* <nav className="hidden md:flex items-center  gap-20 space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive(item.href)
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav> */}

          </div>
          <div className='flex flex-wrap md:font-bold md:text-lg md:gap-16 md:py-2 bg-slate-500 border-0  md:flex  items-center text-center sm:text-left sm:gap-2 sm:text-sm justify-center md:justify-start'>
                {categories.map((category, index) => (
                  <Link
                    key={category.id || index}
                    href={`/categories/${category.slug}`}
                    className="flex mx-4 items-center text-md  font-thin text-foregroundfont-medium transition-colors hover:text-primary"
                  >
                    <span>{category.icon}</span>
                    <span>{category.name}</span> 
                    <span className='mx-auto font-serif h-5 w-5 flex items-center justify-center p-0 text-xs'>|</span>
                  </Link>
                ))}
              </div>
        </div>
        
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      {/* Mobile Search */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsSearchOpen(false)} />
          <div className="fixed top-0 left-0 right-0 bg-background p-4">
            <SearchBar onClose={() => setIsSearchOpen(false)} />
          </div>
        </div>
      )}

      
    </>
  );
}
