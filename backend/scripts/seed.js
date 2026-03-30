const mongoose = require("mongoose");
const Product = require("../src/models/Product");
const Category = require("../src/models/Category");
const Supplier = require("../src/models/Supplier");
const User = require("../src/models/User");
require("dotenv").config();

// Sample products data
const sampleProducts = [
  {
    name: "Wireless Bluetooth Headphones",
    slug: "wireless-bluetooth-headphones",
    description:
      "Premium noise-cancelling wireless headphones with 30-hour battery life and superior sound quality.",
    shortDescription: "Premium wireless headphones with noise cancellation",
    sku: "WBH-001",
    brand: "AudioTech",
    images: [
      {
        url: "https://picsum.photos/800/600?random=1",
        alt: "Wireless Bluetooth Headphones",
        isMain: true,
      },
      {
        url: "https://picsum.photos/800/600?random=2",
        alt: "Headphones Side View",
        isMain: false,
      },
    ],
    variants: [
      {
        name: "Default",
        sku: "WBH-001-DEFAULT",
        price: 89.99,
        comparePrice: 129.99,
        cost: 45.0,
        weight: 0.5,
        dimensions: { length: 20, width: 15, height: 10 },
        inventory: {
          quantity: 150,
          trackQuantity: true,
          allowBackorder: false,
          lowStockThreshold: 20,
        },
        attributes: [{ name: "Color", value: "Black" }],
        images: [
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
        ],
        isActive: true,
      },
    ],
    pricing: {
      basePrice: 89.99,
      price: 89.99,
      comparePrice: 129.99,
      cost: 45.0,
    },
    inventory: {
      quantity: 150,
      trackQuantity: true,
      allowBackorder: false,
      lowStockThreshold: 20,
      reserved: 0,
    },
    isActive: true,
    shipping: {
      weight: 0.5,
      dimensions: { length: 20, width: 15, height: 10 },
      requiresShipping: true,
      shippingClass: "standard",
    },
    tags: ["wireless", "bluetooth", "headphones", "audio"],
    status: "active",
    featured: true,
    rating: 4.5,
    numReviews: 127,
    reviews: [
      {
        rating: 4.5,
        comment: "Great product!",
        user: null,
      },
    ],
  },
  {
    name: "Smart Fitness Watch",
    slug: "smart-fitness-watch",
    description:
      "Advanced fitness tracking watch with heart rate monitor, GPS, and 7-day battery life.",
    shortDescription: "Smart fitness watch with health tracking",
    sku: "SFW-002",
    brand: "FitTech",
    images: [
      {
        url: "https://picsum.photos/800/600?random=3",
        alt: "Smart Fitness Watch",
        isMain: true,
      },
      {
        url: "https://picsum.photos/800/600?random=4",
        alt: "Fitness Watch Side View",
        isMain: false,
      },
    ],
    variants: [
      {
        name: "Default",
        sku: "SFW-002-DEFAULT",
        price: 199.99,
        comparePrice: 249.99,
        cost: 95.0,
        weight: 0.1,
        dimensions: { length: 4, width: 4, height: 1 },
        inventory: {
          quantity: 85,
          trackQuantity: true,
          allowBackorder: false,
          lowStockThreshold: 15,
        },
        attributes: [
          { name: "Size", value: "44mm" },
          { name: "Color", value: "Black" },
        ],
        images: [
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
        ],
        isActive: true,
      },
    ],
    pricing: {
      basePrice: 199.99,
      price: 199.99,
      comparePrice: 249.99,
      cost: 95.0,
    },
    inventory: {
      quantity: 85,
      trackQuantity: true,
      allowBackorder: false,
      lowStockThreshold: 15,
      reserved: 0,
    },
    isActive: true,
    shipping: {
      weight: 0.1,
      dimensions: { length: 4, width: 4, height: 1 },
      requiresShipping: true,
      shippingClass: "standard",
    },
    tags: ["smartwatch", "fitness", "health", "tracker"],
    status: "active",
    featured: true,
    rating: 4.7,
    numReviews: 89,
    reviews: [
      {
        rating: 4.5,
        comment: "Great product!",
        user: null,
      },
    ],
  },
  {
    name: "Wireless Charging Pad",
    slug: "wireless-charging-pad",
    description:
      "Fast wireless charging pad compatible with all Qi-enabled devices.",
    shortDescription: "Fast wireless charger",
    sku: "WCP-030",
    brand: "ChargePro",
    images: [
      {
        url: "https://picsum.photos/800/600?random=101",
        alt: "Charging Pad",
        isMain: true,
      },
    ],
    variants: [
      {
        name: "Default",
        sku: "WCP-030-DEFAULT",
        price: 19.99,
        comparePrice: 29.99,
        cost: 8,
        weight: 0.2,
        dimensions: { length: 10, width: 10, height: 2 },
        inventory: {
          quantity: 250,
          trackQuantity: true,
          allowBackorder: false,
          lowStockThreshold: 30,
        },
        attributes: [{ name: "Color", value: "White" }],
        images: ["https://picsum.photos/800/600?random=102"],
        isActive: true,
      },
    ],
    pricing: { basePrice: 19.99, price: 19.99, comparePrice: 29.99, cost: 8 },
    inventory: {
      quantity: 250,
      trackQuantity: true,
      allowBackorder: false,
      lowStockThreshold: 30,
      reserved: 0,
    },
    isActive: true,
    shipping: {
      weight: 0.2,
      dimensions: { length: 10, width: 10, height: 2 },
      requiresShipping: true,
      shippingClass: "standard",
    },
    tags: ["charger", "wireless"],
    status: "active",
    featured: true,
    rating: 4.4,
    numReviews: 150,
    reviews: [
      {
        rating: 4.5,
        comment: "Great product!",
        user: null,
      },
    ],
  },

  {
    name: "4K Ultra HD Smart TV 43 inch",
    slug: "4k-smart-tv-43",
    description:
      "43-inch 4K Ultra HD Smart TV with HDR and built-in streaming apps.",
    shortDescription: "43 inch 4K Smart TV",
    sku: "TV-031",
    brand: "VisionX",
    images: [
      {
        url: "https://picsum.photos/800/600?random=103",
        alt: "Smart TV",
        isMain: true,
      },
    ],
    variants: [
      {
        name: "Default",
        sku: "TV-031-DEFAULT",
        price: 399.99,
        comparePrice: 499.99,
        cost: 300,
        weight: 7,
        dimensions: { length: 100, width: 60, height: 10 },
        inventory: {
          quantity: 80,
          trackQuantity: true,
          allowBackorder: false,
          lowStockThreshold: 10,
        },
        attributes: [{ name: "Size", value: "43 inch" }],
        images: ["https://picsum.photos/800/600?random=104"],
        isActive: true,
      },
    ],
    pricing: {
      basePrice: 399.99,
      price: 399.99,
      comparePrice: 499.99,
      cost: 300,
    },
    inventory: {
      quantity: 80,
      trackQuantity: true,
      allowBackorder: false,
      lowStockThreshold: 10,
      reserved: 0,
    },
    isActive: true,
    shipping: {
      weight: 7,
      dimensions: { length: 100, width: 60, height: 10 },
      requiresShipping: true,
      shippingClass: "standard",
    },
    tags: ["tv", "electronics"],
    status: "active",
    featured: true,
    rating: 4.7,
    numReviews: 320,
    reviews: [
      {
        rating: 4.5,
        comment: "Great product!",
        user: null,
      },
    ],
  },

  {
    name: "Mechanical Keyboard RGB",
    slug: "mechanical-keyboard-rgb",
    description:
      "Mechanical keyboard with blue switches and customizable RGB lighting.",
    shortDescription: "RGB mechanical keyboard",
    sku: "KB-032",
    brand: "KeyMaster",
    images: [
      {
        url: "https://picsum.photos/800/600?random=105",
        alt: "Keyboard",
        isMain: true,
      },
    ],
    variants: [
      {
        name: "Default",
        sku: "KB-032-DEFAULT",
        price: 69.99,
        comparePrice: 99.99,
        cost: 35,
        weight: 1,
        dimensions: { length: 45, width: 15, height: 4 },
        inventory: {
          quantity: 120,
          trackQuantity: true,
          allowBackorder: false,
          lowStockThreshold: 20,
        },
        attributes: [{ name: "Switch Type", value: "Blue" }],
        images: ["https://picsum.photos/800/600?random=106"],
        isActive: true,
      },
    ],
    pricing: { basePrice: 69.99, price: 69.99, comparePrice: 99.99, cost: 35 },
    inventory: {
      quantity: 120,
      trackQuantity: true,
      allowBackorder: false,
      lowStockThreshold: 20,
      reserved: 0,
    },
    isActive: true,
    shipping: {
      weight: 1,
      dimensions: { length: 45, width: 15, height: 4 },
      requiresShipping: true,
      shippingClass: "standard",
    },
    tags: ["keyboard", "gaming"],
    status: "active",
    featured: false,
    rating: 4.6,
    numReviews: 210,
    reviews: [
      {
        rating: 4.5,
        comment: "Great product!",
        user: null,
      },
    ],
  },

  {
    name: "Men Casual Sneakers",
    slug: "men-casual-sneakers",
    description: "Comfortable and stylish sneakers for everyday wear.",
    shortDescription: "Casual sneakers",
    sku: "SN-033",
    brand: "StreetWear",
    images: [
      {
        url: "https://picsum.photos/800/600?random=107",
        alt: "Sneakers",
        isMain: true,
      },
    ],
    variants: [
      {
        name: "Default",
        sku: "SN-033-DEFAULT",
        price: 59.99,
        comparePrice: 89.99,
        cost: 25,
        weight: 0.9,
        dimensions: { length: 30, width: 15, height: 10 },
        inventory: {
          quantity: 200,
          trackQuantity: true,
          allowBackorder: false,
          lowStockThreshold: 30,
        },
        attributes: [{ name: "Size", value: "9" }],
        images: ["https://picsum.photos/800/600?random=108"],
        isActive: true,
      },
    ],
    pricing: { basePrice: 59.99, price: 59.99, comparePrice: 89.99, cost: 25 },
    inventory: {
      quantity: 200,
      trackQuantity: true,
      allowBackorder: false,
      lowStockThreshold: 30,
      reserved: 0,
    },
    isActive: true,
    shipping: {
      weight: 0.9,
      dimensions: { length: 30, width: 15, height: 10 },
      requiresShipping: true,
      shippingClass: "standard",
    },
    tags: ["shoes", "men"],
    status: "active",
    featured: true,
    rating: 4.3,
    numReviews: 140,
    reviews: [
      {
        rating: 4.5,
        comment: "Great product!",
        user: null,
      },
    ],
  },

  {
    name: "Portable Bluetooth Speaker",
    slug: "portable-bluetooth-speaker",
    description: "Compact speaker with powerful bass and 12-hour playtime.",
    shortDescription: "Portable speaker",
    sku: "SP-034",
    brand: "SoundMax",
    images: [
      {
        url: "https://picsum.photos/800/600?random=109",
        alt: "Speaker",
        isMain: true,
      },
    ],
    variants: [
      {
        name: "Default",
        sku: "SP-034-DEFAULT",
        price: 34.99,
        comparePrice: 54.99,
        cost: 15,
        weight: 0.6,
        dimensions: { length: 20, width: 8, height: 8 },
        inventory: {
          quantity: 220,
          trackQuantity: true,
          allowBackorder: false,
          lowStockThreshold: 25,
        },
        attributes: [{ name: "Color", value: "Blue" }],
        images: ["https://picsum.photos/800/600?random=110"],
        isActive: true,
      },
    ],
    pricing: { basePrice: 34.99, price: 34.99, comparePrice: 54.99, cost: 15 },
    inventory: {
      quantity: 220,
      trackQuantity: true,
      allowBackorder: false,
      lowStockThreshold: 25,
      reserved: 0,
    },
    isActive: true,
    shipping: {
      weight: 0.6,
      dimensions: { length: 20, width: 8, height: 8 },
      requiresShipping: true,
      shippingClass: "standard",
    },
    tags: ["speaker", "audio"],
    status: "active",
    featured: false,
    rating: 4.5,
    numReviews: 198,
    reviews: [
      {
        rating: 4.5,
        comment: "Great product!",
        user: null,
      },
    ],
  },

  // 👉 I continue pattern for realism

  {
    name: "LED Desk Lamp",
    slug: "led-desk-lamp",
    description: "Energy-efficient LED desk lamp with adjustable brightness.",
    shortDescription: "LED study lamp",
    sku: "LAMP-035",
    brand: "BrightLite",
    images: [
      {
        url: "https://picsum.photos/800/600?random=111",
        alt: "Lamp",
        isMain: true,
      },
    ],
    variants: [
      {
        name: "Default",
        sku: "LAMP-035-DEFAULT",
        price: 24.99,
        comparePrice: 39.99,
        cost: 10,
        weight: 0.7,
        dimensions: { length: 25, width: 10, height: 10 },
        inventory: {
          quantity: 150,
          trackQuantity: true,
          allowBackorder: false,
          lowStockThreshold: 20,
        },
        attributes: [{ name: "Color", value: "White" }],
        images: ["https://picsum.photos/800/600?random=112"],
        isActive: true,
      },
    ],
    pricing: { basePrice: 24.99, price: 24.99, comparePrice: 39.99, cost: 10 },
    inventory: {
      quantity: 150,
      trackQuantity: true,
      allowBackorder: false,
      lowStockThreshold: 20,
      reserved: 0,
    },
    isActive: true,
    shipping: {
      weight: 0.7,
      dimensions: { length: 25, width: 10, height: 10 },
      requiresShipping: true,
      shippingClass: "standard",
    },
    tags: ["lamp", "study"],
    status: "active",
    featured: true,
    rating: 4.2,
    numReviews: 90,
    reviews: [
      {
        rating: 4.5,
        comment: "Great product!",
        user: null,
      },
    ],
  },
  {
    name: "Laptop Backpack",
    slug: "laptop-backpack",
    description:
      "Durable waterproof laptop backpack with multiple compartments.",
    shortDescription: "Waterproof backpack",
    sku: "LB-004",
    brand: "UrbanCarry",
    images: [
      {
        url: "https://picsum.photos/800/600?random=7",
        alt: "Backpack",
        isMain: true,
      },
    ],
    variants: [
      {
        name: "Default",
        sku: "LB-004-DEFAULT",
        price: 39.99,
        comparePrice: 59.99,
        cost: 18,
        weight: 0.8,
        dimensions: { length: 40, width: 30, height: 10 },
        inventory: {
          quantity: 180,
          trackQuantity: true,
          allowBackorder: false,
          lowStockThreshold: 25,
        },
        attributes: [{ name: "Color", value: "Grey" }],
        images: ["https://picsum.photos/800/600?random=8"],
        isActive: true,
      },
    ],
    pricing: { basePrice: 39.99, price: 39.99, comparePrice: 59.99, cost: 18 },
    inventory: {
      quantity: 180,
      trackQuantity: true,
      allowBackorder: false,
      lowStockThreshold: 25,
      reserved: 0,
    },
    isActive: true,
    shipping: {
      weight: 0.8,
      dimensions: { length: 40, width: 30, height: 10 },
      requiresShipping: true,
      shippingClass: "standard",
    },
    tags: ["bag", "laptop"],
    status: "active",
    featured: false,
    rating: 4.3,
    numReviews: 76,
    reviews: [
      {
        rating: 4.5,
        comment: "Great product!",
        user: null,
      },
    ],
  },
  {
    name: "Women Handbag Leather",
    slug: "women-handbag-leather",
    description: "Elegant leather handbag for women",
    sku: "FASH-005",
    price: 1999,
    comparePrice: 2599,
    cost: 900,
    weight: 0.5,
    dimensions: { length: 25, width: 20, height: 8 },
    inventory: {
      quantity: 80,
      trackQuantity: true,
      allowBackorder: false,
      lowStockThreshold: 15,
    },
    attributes: [
      { name: "Material", value: "Leather" },
      { name: "Color", value: "Brown" },
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800",
        alt: "Handbag",
        isMain: true,
      },
    ],
    isActive: true,
    pricing: { basePrice: 1999, price: 1999, comparePrice: 2599, cost: 900 },
    shipping: {
      weight: 0.5,
      dimensions: { length: 25, width: 20, height: 8 },
      requiresShipping: true,
      shippingClass: "standard",
    },
    tags: ["bag", "women", "fashion"],
    status: "active",
    featured: true,
    rating: 4.2,
    numReviews: 70,
    reviews: [
      {
        rating: 4.5,
        comment: "Great product!",
        user: null,
      },
    ],
  },
  {
    name: "Gaming Mouse RGB",
    slug: "gaming-mouse-rgb",
    sku: "GAM-004",
    price: 899,
    description:
      "Gaming Mouse RGB with high precision and customizable lighting",
    comparePrice: 1299,
    cost: 400,
    weight: 0.2,
    dimensions: { length: 12, width: 6, height: 4 },
    inventory: {
      quantity: 200,
      trackQuantity: true,
      allowBackorder: true,
      lowStockThreshold: 25,
    },
    attributes: [
      { name: "DPI", value: "16000" },
      { name: "Color", value: "Black" },
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1587202372775-989e9b3c19c9?w=800",
        alt: "Gaming Mouse",
        isMain: true,
      },
    ],
    isActive: true,
    pricing: { basePrice: 899, price: 899, comparePrice: 1299, cost: 400 },
    shipping: {
      weight: 0.2,
      dimensions: { length: 12, width: 6, height: 4 },
      requiresShipping: true,
      shippingClass: "standard",
    },
    tags: ["gaming", "mouse", "pc"],
    status: "active",
    featured: false,
    rating: 4.4,
    numReviews: 150,
    reviews: [
      {
        rating: 4.5,
        comment: "Great product!",
        user: null,
      },
    ],
  },
  {
    name: "Organic Yoga Mat",
    slug: "organic-yoga-mat",
    description:
      "Eco-friendly non-slip yoga mat made from natural rubber with alignment markers.",
    shortDescription: "Eco-friendly non-slip yoga mat",
    sku: "OYM-003",
    brand: "EcoFit",
    images: [
      {
        url: "https://picsum.photos/800/600?random=5",
        alt: "Organic Yoga Mat",
        isMain: true,
      },
      {
        url: "https://picsum.photos/800/600?random=6",
        alt: "Yoga Mat Rolled Up",
        isMain: false,
      },
    ],
    variants: [
      {
        name: "Default",
        sku: "OYM-003-DEFAULT",
        price: 34.99,
        comparePrice: 49.99,
        cost: 18.0,
        weight: 1.2,
        dimensions: { length: 183, width: 61, height: 0.6 },
        inventory: {
          quantity: 200,
          trackQuantity: true,
          allowBackorder: false,
          lowStockThreshold: 30,
        },
        attributes: [
          { name: "Color", value: "Purple" },
          { name: "Thickness", value: "6mm" },
        ],
        images: ["https://picsum.photos/800/600?random=5"],
        isActive: true,
      },
    ],
    pricing: {
      basePrice: 34.99,
      price: 34.99,
      comparePrice: 49.99,
      cost: 18.0,
    },
    inventory: {
      quantity: 200,
      trackQuantity: true,
      allowBackorder: false,
      lowStockThreshold: 30,
      reserved: 0,
    },
    isActive: true,
    shipping: {
      weight: 1.2,
      dimensions: { length: 183, width: 61, height: 0.6 },
      requiresShipping: true,
      shippingClass: "standard",
    },
    tags: ["yoga", "fitness", "eco-friendly", "exercise"],
    status: "active",

    rating: 4.6,
    numReviews: 156,
    reviews: [
      {
        rating: 4.5,
        comment: "Great product!",
        user: null,
      },
    ],
  },
  {
    name: "Ceramic Coffee Maker Set",
    slug: "ceramic-coffee-maker-set",
    description:
      "Handcrafted ceramic coffee maker with 4 cups and matching saucers. Perfect for coffee lovers.",
    shortDescription: "Handcrafted ceramic coffee maker set",
    sku: "CCM-004",
    brand: "ArtisanHome",
    images: [
      {
        url: "https://picsum.photos/800/600?random=7",
        alt: "Ceramic Coffee Maker Set",
        isMain: true,
      },
      {
        url: "https://picsum.photos/800/600?random=8",
        alt: "Coffee Maker with Cups",
        isMain: false,
      },
    ],
    variants: [
      {
        name: "Default",
        sku: "CCM-004-DEFAULT",
        price: 79.99,
        comparePrice: 99.99,
        cost: 42.0,
        weight: 2.5,
        dimensions: { length: 30, width: 20, height: 25 },
        inventory: {
          quantity: 60,
          trackQuantity: true,
          allowBackorder: false,
          lowStockThreshold: 10,
        },
        attributes: [{ name: "Color", value: "White" }],
        images: ["https://picsum.photos/800/600?random=7"],
        isActive: true,
      },
    ],
    pricing: {
      basePrice: 79.99,
      price: 79.99,
      comparePrice: 99.99,
      cost: 42.0,
    },
    inventory: {
      quantity: 60,
      trackQuantity: true,
      allowBackorder: false,
      lowStockThreshold: 10,
      reserved: 0,
    },
    isActive: true,
    shipping: {
      weight: 2.5,
      dimensions: { length: 30, width: 20, height: 25 },
      requiresShipping: true,
      shippingClass: "standard",
    },
    tags: ["coffee", "ceramic", "kitchen", "home"],
    status: "active",

    rating: 4.8,
    numReviews: 94,
    reviews: [
      {
        rating: 4.5,
        comment: "Great product!",
        user: null,
      },
    ],
  },
  {
    name: "Professional Makeup Brush Set",
    slug: "professional-makeup-brush-set",
    description:
      "Complete 15-piece professional makeup brush set with premium synthetic bristles.",
    shortDescription: "Professional 15-piece makeup brush set",
    sku: "PMB-005",
    brand: "BeautyPro",
    images: [
      {
        url: "https://picsum.photos/800/600?random=9",
        alt: "Professional Makeup Brush Set",
        isMain: true,
      },
      {
        url: "https://picsum.photos/800/600?random=10",
        alt: "Makeup Brushes Collection",
        isMain: false,
      },
    ],
    variants: [
      {
        name: "Default",
        sku: "PMB-005-DEFAULT",
        price: 45.99,
        comparePrice: 69.99,
        cost: 22.0,
        weight: 0.8,
        dimensions: { length: 25, width: 15, height: 8 },
        inventory: {
          quantity: 120,
          trackQuantity: true,
          allowBackorder: false,
          lowStockThreshold: 20,
        },
        attributes: [{ name: "Set Type", value: "15 Piece" }],
        images: [
          "https://images.unsplash.com/photo-1596462502278-274cbbb4063e?w=800",
        ],
        isActive: true,
      },
    ],
    pricing: {
      basePrice: 45.99,
      price: 45.99,
      comparePrice: 69.99,
      cost: 22.0,
    },
    inventory: {
      quantity: 120,
      trackQuantity: true,
      allowBackorder: false,
      lowStockThreshold: 20,
      reserved: 0,
    },
    isActive: true,
    shipping: {
      weight: 0.8,
      dimensions: { length: 25, width: 15, height: 8 },
      requiresShipping: true,
      shippingClass: "standard",
    },
    tags: ["makeup", "brushes", "beauty", "cosmetics"],
    status: "active",
    featured: true,
    rating: 4.4,
    numReviews: 203,
    reviews: [
      {
        rating: 4.5,
        comment: "Great product!",
        user: null,
      },
    ],
  },
];

// Sample categories
const sampleCategories = [
  {
    name: "Electronics",
    slug: "electronics",
    path: "electronics",
    description: "Latest gadgets and electronic devices",
    image: {
      url: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800",
      alt: "Electronics category",
    },
    icon: "📱",
    parent: null,
    isActive: true,
    sortOrder: 1,
  },
  {
    name: "Fashion",
    slug: "fashion",
    path: "fashion",
    description: "Trendy clothing and accessories",
    image: {
      url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
      alt: "Fashion category",
    },
    icon: "👔",
    parent: null,
    isActive: true,
    sortOrder: 2,
  },
  {
    name: "Home & Living",
    slug: "home-living",
    path: "home-living",
    description: "Home decor and kitchen essentials",
    image: {
      url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
      alt: "Home & Living category",
    },
    icon: "🏠",
    parent: null,
    isActive: true,
    sortOrder: 3,
  },
  {
    name: "Sports & Fitness",
    slug: "sports",
    path: "sports",
    description: "Fitness equipment and sports gear",
    image: {
      url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
      alt: "Sports & Fitness category",
    },
    icon: "💪",
    parent: null,
    isActive: true,
    sortOrder: 4,
  },
  {
    name: "Beauty & Personal Care",
    slug: "beauty",
    path: "beauty",
    description: "Cosmetics and personal care products",
    image: {
      url: "https://images.unsplash.com/photo-1596462502278-274cbbb4063e?w=800",
      alt: "Beauty & Personal Care category",
    },
    icon: "💄",
    parent: null,
    isActive: true,
    sortOrder: 5,
  },
];

// Sample supplier
const sampleSupplier = {
  name: "Global Suppliers Inc",
  slug: "global-suppliers-inc",
  description: "A leading global supplier of quality products",
  contact: {
    email: "contact@globalsuppliers.com",
    phone: "+1-555-0123",
    address: {
      street: "123 Supplier Street",
      city: "Commerce City",
      state: "CA",
      zipCode: "12345",
      country: "USA",
    },
  },
  performance: {
    totalOrders: 1250,
    successfulOrders: 1200,
    failedOrders: 50,
    averageProcessingTime: 24,
    averageShippingTime: 3,
    rating: {
      average: 4.8,
      count: 450,
    },
  },
  pricing: {
    commissionRate: 10,
    shippingRates: [
      {
        method: "standard",
        baseRate: 5.99,
        perItemRate: 1.99,
        freeShippingThreshold: 50,
      },
      {
        method: "express",
        baseRate: 12.99,
        perItemRate: 2.99,
        freeShippingThreshold: 100,
      },
    ],
  },
  integration: {
    type: "manual",
    autoSync: false,
    syncFrequency: 24,
  },
  isActive: true,
};

async function seedDatabase() {
  try {
    // Connect to database
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce_businness",
    );
    console.log("Connected to MongoDB");

    // Clear existing data
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Supplier.deleteMany({});
    console.log("Cleared existing data");

    // Insert supplier first
    const supplier = await Supplier.create(sampleSupplier);
    console.log("Created supplier:", supplier.name);

    // Insert categories
    const categories = await Category.insertMany(sampleCategories);
    console.log(`Created ${categories.length} categories`);

    // Create category lookup map
    const categoryMap = {};
    categories.forEach((cat) => {
      categoryMap[cat.slug] = cat._id;
    });

    // Update products with category references and supplier
    const productsWithRefs = sampleProducts.map((product, index) => {
      let categorySlug = "electronics"; // default

      // 🔥 Fix variants
      if (!product.variants || product.variants.length === 0) {
        product.variants = [
          {
            name: "Default",
            sku: `${product.sku || "SKU"}-DEFAULT-${index}`, // UNIQUE
            price: product.pricing?.price || product.price || 100,
            comparePrice: product.pricing?.comparePrice || 150,
            cost: product.pricing?.cost || 50,
            weight: 0.5,
            dimensions: { length: 10, width: 10, height: 5 },
            inventory: {
              quantity: 50,
              trackQuantity: true,
              allowBackorder: false,
              lowStockThreshold: 10,
            },
            attributes: [{ name: "Color", value: "Default" }],
            images: product.images?.map((img) => img.url || img) || [],
            isActive: true,
          },
        ];
      }
      // Assign categories based on product type
      if (index === 0 || index === 1) {
        categorySlug = "electronics"; // Headphones, Smart Watch
      } else if (index === 2) {
        categorySlug = "sports"; // Yoga Mat
      } else if (index === 3) {
        categorySlug = "home-living"; // Coffee Maker
      } else if (index === 4) {
        categorySlug = "beauty"; // Makeup Brushes
      }

      return {
        ...product,
        category: categoryMap[categorySlug],
        supplier: supplier._id,
      };
    });

    // Insert products
    const products = await Product.insertMany(productsWithRefs);
    console.log(`Created ${products.length} products`);

    console.log("Database seeded successfully!");

    // Close connection
    await mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
