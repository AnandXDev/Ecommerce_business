"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SearchBar } from "../common/SearchBar";
import CountryModal from "@/components/CountryModal";
import { CartSidebar } from "../cart/CartSidebar";
import { UserMenu } from "./UserMenu";
import { MobileMenu } from "./MobileMenu";
import { ShoppingCart, User, Menu, Search } from "lucide-react";
import { CategoryRow } from "../CategoryRow";
import { LuAlignJustify } from "react-icons/lu";

// Categories for navigation
const categories = [
  {
    id: "2",
    name: "Electronics",
    slug: "electronics",
    productCount: 234,
    subcategories: ["Mobiles", "Laptops", "Accessories"],
  },
  {
    id: "3",
    name: "Home & Kitchen",
    slug: "home-kitchen",

    productCount: 156,
    subcategories: ["Furniture", "Appliances", "Decor"],
  },
  {
    id: "4",
    name: "Fashion",
    slug: "fashion",
    productCount: 189,
    subcategories: ["Men", "Women", "Kids"],
  },
  {
    id: "5",
    name: "Fitness",
    slug: "fitness",
    productCount: 98,
    subcategories: ["Workout Gear", "Supplements"],
  },
  {
    id: "6",
    name: "Beauty",
    slug: "beauty",
    productCount: 76,
    subcategories: ["Skincare", "Makeup", "Hair Care"],
  },
  {
    id: "7",
    name: "Accessories",
    slug: "accessories",

    productCount: 45,
    subcategories: ["Watches", "Bags", "Jewelry"],
  },
  {
    id: "8",
    name: "Toys & Games",
    slug: "toys",
    productCount: 55,
    subcategories: ["Action Figures", "Board Games", "Puzzles"],
  },
  {
    id: "9",
    name: "Books",
    slug: "books",
    productCount: 90,
    subcategories: ["Fiction", "Non-fiction", "Educational"],
  },
  {
    id: "10",
    name: "Baby Products",
    slug: "baby",
    productCount: 40,
    subcategories: ["Diapers", "Toys", "Clothing"],
  },
  {
    id: "11",
    name: "Pet Supplies",
    slug: "pets",
    productCount: 35,
    subcategories: ["Dog Food", "Cat Food", "Accessories"],
  },
  {
    id: "12",
    name: "Computers",
    slug: "computers",
    productCount: 75,
    subcategories: ["Desktops", "Monitors", "Keyboards"],
  },
  {
    id: "13",
    name: "Gaming",
    slug: "gaming",
    productCount: 65,
    subcategories: ["Consoles", "Games", "Accessories"],
  },
  {
    id: "15",
    name: "Furniture",
    slug: "furniture",
    productCount: 85,
    subcategories: ["Sofas", "Beds", "Tables"],
  },
];
export function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const { cart } = useCart();
  const pathname = usePathname();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
 
  const [country, setCountry] = useState({
    name: "India",
    flag: "https://flagcdn.com/w40/in.png",
  });
const handleCountrySelect = (c:any) => {
  setCountry(c);
  // Modal will close via onClose prop
};

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },

    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  
  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="sticky bg-white text-black  top-0 z-40 w-full border-b border-muted">
        <div className="">
          <div className="flex mx-11 h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center mx-4">
  <Link href="/" className="flex items-center space-x-2 group">

    {/* Luxe Text */}
    <span className="text-4xl font-semibold text-gray-900 tracking-tight">
      Luxe
    </span>

    {/* Cart Logo */}
    <span className="relative flex items-center justify-center">
      
      {/* Glow Effect */}
      <span className="absolute w-10 h-10 bg-yellow-400/40 blur-xl rounded-full group-hover:scale-110 transition"></span>

      {/* Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-10 h-10 text-yellow-500 drop-shadow-md"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6h13M7 13L5.4 5M16 21a1 1 0 100-2 1 1 0 000 2zM9 21a1 1 0 100-2 1 1 0 000 2z"
        />
      </svg>
    </span>

    {/* Cart Text */}
    <span className="text-4xl font-semibold text-gray-900 tracking-tight">
      art
    </span>

  </Link>
</div>

            {/* Actions */}
            <div className="flex items-center space-x-4 flex-1 max-w-2xl mx-4">
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
              
            {/* Location + Country UI */}
            <div className="hidden md:flex items-center gap-4 border-l pl-4">
              {/* Country */}
              <div
                onClick={() => setOpen(true)}
                className="flex flex-col cursor-pointer group relative"
              >
                <span className="text-xs text-gray-500">Country</span>

                <span className="text-sm font-medium flex items-center gap-2 text-gray-800 group-hover:text-blue-500 transition">
                  <img
                    src={country.flag}
                    alt={country.name}
                    className="w-5 h-4 object-cover rounded-sm"
                  />
                  {country.name}
                </span>
                <CountryModal isOpen={open} onClose={() => setOpen(false)} onSelectLocation={handleCountrySelect} />
              

                {/* Hover Line */}
               <span className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-0  transition-all duration-300 group-hover:w-full"></span>
              </div>

              {/* Divider */}
              <div className="h-6 w-[1px] bg-gray-300"></div>

              {/* Address */}
              <div className="flex flex-col cursor-pointer group max-w-[180px]">
                <span className="text-xs text-gray-500">Deliver to</span>
                <span className="text-sm font-medium truncate flex items-center gap-1 group-hover:text-gray-800 transition">
                  📍{user?.addresses?.[0]?.street || "Select Address"}
                </span>

                {/* Hover Line */}
                
              </div>
            </div>
            <hr />
            <button
              onClick={() => (window.location.href = "/cart")}
              className="relative p-2 rounded-md hover:bg-accent"
            >
              <ShoppingCart className="h-5 w-5" />
              {cart.itemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {cart.itemCount}
                </Badge>
              )}
            </button>
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button
                  variant="ghost"
                  asChild
                  className="
      rounded-xl px-4 py-2 text-sm font-medium
      text-cyan-300
      hover:text-white
      hover:bg-cyan-500/10
      transition-all duration-300
    "
                >
                  <Link href="/login">Sign In</Link>
                </Button>

                <Button
                  asChild
                  className="
      rounded-xl px-4 py-2 text-sm font-medium
      bg-cyan-500 text-black
      hover:bg-cyan-400
      shadow-[0_6px_20px_rgba(34,211,238,0.4)]
      transition-all duration-300
      active:scale-[0.97]
    "
                >
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
          <hr />
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
          <div className="flex  gap-7 px-14 py-4  relative">
            {categories.map((category) => (
              <div
                key={category.id}
                className="relative"
                onMouseEnter={() => {
                  if (window.innerWidth >= 768) {
                    setActiveCategory(category.name);
                  }
                }}
                onMouseLeave={() => {
                  if (window.innerWidth >= 768) {
                    setActiveCategory(null);
                  }
                }}
              >
                {/* Category Button */}
                <button
                  onClick={() => {
                    if (window.innerWidth < 768) {
                      setActiveCategory(
                        activeCategory === category.name ? null : category.name,
                      );
                    }
                  }}
                  className="flex items-center gap-2 text-black relative after:content-[''] after:absolute after:top-6 after:left-0 after:bottom-0 after:w-0 after:h-[4px] after:bg-blue-500 after:transition-all hover:after:w-full"
                >
                  <span className="text-balance">{category.name}</span>
                </button>

                {/* Dropdown */}
                {activeCategory === category.name && (
                  <div className="absolute top-7 left-0 bg-white shadow-xl rounded-lg p-4 min-w-[220px] z-50">
                    {category.subcategories?.map((sub, i) => (
                      <Link
                        key={i}
                        href={`/products?category=${category.slug}&sub=${sub}`}
                        className="block px-3 py-2 hover:bg-gray-100 rounded"
                      >
                        {sub}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
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
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Mobile Search */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsSearchOpen(false)}
          />
          <div className="fixed top-0 left-0 right-0 bg-background p-4">
            <SearchBar onClose={() => setIsSearchOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
