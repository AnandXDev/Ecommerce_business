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
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container-custom">
          <div className="flex h-16 items-center justify-around">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">DS</span>
                </div>
                <span className="text-xl font-bold text-foreground">LuxeCart</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            {/* <nav className="hidden md:flex items-center space-x-6">
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
