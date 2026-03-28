const mongoose = require('mongoose');
const Product = require('../src/models/Product');
const Category = require('../src/models/Category');
const Supplier = require('../src/models/Supplier');
const User = require('../src/models/User');
require('dotenv').config();

// Sample products data
const sampleProducts = [
  {
    name: 'Wireless Bluetooth Headphones',
    slug: 'wireless-bluetooth-headphones',
    description: 'Premium noise-cancelling wireless headphones with 30-hour battery life and superior sound quality.',
    shortDescription: 'Premium wireless headphones with noise cancellation',
    sku: 'WBH-001',
    brand: 'AudioTech',
    images: [
      {
        url: 'https://picsum.photos/800/600?random=1',
        alt: 'Wireless Bluetooth Headphones',
        isMain: true
      },
      {
        url: 'https://picsum.photos/800/600?random=2',
        alt: 'Headphones Side View',
        isMain: false
      }
    ],
    variants: [
      {
        name: 'Default',
        sku: 'WBH-001-DEFAULT',
        price: 89.99,
        comparePrice: 129.99,
        cost: 45.00,
        weight: 0.5,
        dimensions: { length: 20, width: 15, height: 10 },
        inventory: {
          quantity: 150,
          trackQuantity: true,
          allowBackorder: false,
          lowStockThreshold: 20
        },
        attributes: [
          { name: 'Color', value: 'Black' }
        ],
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'],
        isActive: true
      }
    ],
    pricing: {
      basePrice: 89.99,
      price: 89.99,
      comparePrice: 129.99,
      cost: 45.00
    },
    inventory: {
      quantity: 150,
      trackQuantity: true,
      allowBackorder: false,
      lowStockThreshold: 20,
      reserved: 0
    },
    isActive: true,
    shipping: {
      weight: 0.5,
      dimensions: { length: 20, width: 15, height: 10 },
      requiresShipping: true,
      shippingClass: 'standard'
    },
    tags: ['wireless', 'bluetooth', 'headphones', 'audio'],
    status: 'active',
    featured: true,
    rating: 4.5,
    numReviews: 127,
    reviews: {
      averageRating: 4.5,
      count: 127
    }
  },
  {
    name: 'Smart Fitness Watch',
    slug: 'smart-fitness-watch',
    description: 'Advanced fitness tracking watch with heart rate monitor, GPS, and 7-day battery life.',
    shortDescription: 'Smart fitness watch with health tracking',
    sku: 'SFW-002',
    brand: 'FitTech',
    images: [
      {
        url: 'https://picsum.photos/800/600?random=3',
        alt: 'Smart Fitness Watch',
        isMain: true
      },
      {
        url: 'https://picsum.photos/800/600?random=4',
        alt: 'Fitness Watch Side View',
        isMain: false
      }
    ],
    variants: [
      {
        name: 'Default',
        sku: 'SFW-002-DEFAULT',
        price: 199.99,
        comparePrice: 249.99,
        cost: 95.00,
        weight: 0.1,
        dimensions: { length: 4, width: 4, height: 1 },
        inventory: {
          quantity: 85,
          trackQuantity: true,
          allowBackorder: false,
          lowStockThreshold: 15
        },
        attributes: [
          { name: 'Size', value: '44mm' },
          { name: 'Color', value: 'Black' }
        ],
        images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'],
        isActive: true
      }
    ],
    pricing: {
      basePrice: 199.99,
      price: 199.99,
      comparePrice: 249.99,
      cost: 95.00
    },
    inventory: {
      quantity: 85,
      trackQuantity: true,
      allowBackorder: false,
      lowStockThreshold: 15,
      reserved: 0
    },
    isActive: true,
    shipping: {
      weight: 0.1,
      dimensions: { length: 4, width: 4, height: 1 },
      requiresShipping: true,
      shippingClass: 'standard'
    },
    tags: ['smartwatch', 'fitness', 'health', 'tracker'],
    status: 'active',
    featured: true,
    rating: 4.7,
    numReviews: 89,
    reviews: {
      averageRating: 4.7,
      count: 89
    }
  },
  {
    name: 'Women Handbag Leather',
    sku: 'FASH-005',
    price: 1999,
    comparePrice: 2599,
    cost: 900,
    weight: 0.5,
    dimensions: { length: 25, width: 20, height: 8 },
    inventory: {
      quantity: 80,
      trackQuantity: true,
      allowBackorder: false,
      lowStockThreshold: 15
    },
    attributes: [
      { name: 'Material', value: 'Leather' },
      { name: 'Color', value: 'Brown' }
    ],
    images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800'],
    isActive: true,
    pricing: { basePrice: 1999, price: 1999, comparePrice: 2599, cost: 900 },
    shipping: {
      weight: 0.5,
      dimensions: { length: 25, width: 20, height: 8 },
      requiresShipping: true,
      shippingClass: 'standard'
    },
    tags: ['bag', 'women', 'fashion'],
    status: 'active',
    featured: true,
    rating: 4.2,
    numReviews: 70,
    reviews: { averageRating: 4.2, count: 70 }
  },
  {
    name: 'Gaming Mouse RGB',
    sku: 'GAM-004',
    price: 899,
    comparePrice: 1299,
    cost: 400,
    weight: 0.2,
    dimensions: { length: 12, width: 6, height: 4 },
    inventory: {
      quantity: 200,
      trackQuantity: true,
      allowBackorder: true,
      lowStockThreshold: 25
    },
    attributes: [
      { name: 'DPI', value: '16000' },
      { name: 'Color', value: 'Black' }
    ],
    images: ['https://images.unsplash.com/photo-1587202372775-989e9b3c19c9?w=800'],
    isActive: true,
    pricing: { basePrice: 899, price: 899, comparePrice: 1299, cost: 400 },
    shipping: {
      weight: 0.2,
      dimensions: { length: 12, width: 6, height: 4 },
      requiresShipping: true,
      shippingClass: 'standard'
    },
    tags: ['gaming', 'mouse', 'pc'],
    status: 'active',
    featured: false,
    rating: 4.4,
    numReviews: 150,
    reviews: { averageRating: 4.4, count: 150 }
  },
  {
    name: 'Organic Yoga Mat',
    slug: 'organic-yoga-mat',
    description: 'Eco-friendly non-slip yoga mat made from natural rubber with alignment markers.',
    shortDescription: 'Eco-friendly non-slip yoga mat',
    sku: 'OYM-003',
    brand: 'EcoFit',
    images: [
      {
        url: 'https://picsum.photos/800/600?random=5',
        alt: 'Organic Yoga Mat',
        isMain: true
      },
      {
        url: 'https://picsum.photos/800/600?random=6',
        alt: 'Yoga Mat Rolled Up',
        isMain: false
      }
    ],
    variants: [
      {
        name: 'Default',
        sku: 'OYM-003-DEFAULT',
        price: 34.99,
        comparePrice: 49.99,
        cost: 18.00,
        weight: 1.2,
        dimensions: { length: 183, width: 61, height: 0.6 },
        inventory: {
          quantity: 200,
          trackQuantity: true,
          allowBackorder: false,
          lowStockThreshold: 30
        },
        attributes: [
          { name: 'Color', value: 'Purple' },
          { name: 'Thickness', value: '6mm' }
        ],
        images: ['https://picsum.photos/800/600?random=5'],
        isActive: true
      }
    ],
    pricing: {
      basePrice: 34.99,
      price: 34.99,
      comparePrice: 49.99,
      cost: 18.00
    },
    inventory: {
      quantity: 200,
      trackQuantity: true,
      allowBackorder: false,
      lowStockThreshold: 30,
      reserved: 0
    },
    isActive: true,
    shipping: {
      weight: 1.2,
      dimensions: { length: 183, width: 61, height: 0.6 },
      requiresShipping: true,
      shippingClass: 'standard'
    },
    tags: ['yoga', 'fitness', 'eco-friendly', 'exercise'],
    status: 'active',
    isFeatured: false,
    rating: 4.6,
    numReviews: 156,
    reviews: {
      averageRating: 4.6,
      count: 156
    }
  },
  {
    name: 'Ceramic Coffee Maker Set',
    slug: 'ceramic-coffee-maker-set',
    description: 'Handcrafted ceramic coffee maker with 4 cups and matching saucers. Perfect for coffee lovers.',
    shortDescription: 'Handcrafted ceramic coffee maker set',
    sku: 'CCM-004',
    brand: 'ArtisanHome',
    images: [
      {
        url: 'https://picsum.photos/800/600?random=7',
        alt: 'Ceramic Coffee Maker Set',
        isMain: true
      },
      {
        url: 'https://picsum.photos/800/600?random=8',
        alt: 'Coffee Maker with Cups',
        isMain: false
      }
    ],
    variants: [
      {
        name: 'Default',
        sku: 'CCM-004-DEFAULT',
        price: 79.99,
        comparePrice: 99.99,
        cost: 42.00,
        weight: 2.5,
        dimensions: { length: 30, width: 20, height: 25 },
        inventory: {
          quantity: 60,
          trackQuantity: true,
          allowBackorder: false,
          lowStockThreshold: 10
        },
        attributes: [
          { name: 'Color', value: 'White' }
        ],
        images: ['https://picsum.photos/800/600?random=7'],
        isActive: true
      }
    ],
    pricing: {
      basePrice: 79.99,
      price: 79.99,
      comparePrice: 99.99,
      cost: 42.00
    },
    inventory: {
      quantity: 60,
      trackQuantity: true,
      allowBackorder: false,
      lowStockThreshold: 10,
      reserved: 0
    },
    isActive: true,
    shipping: {
      weight: 2.5,
      dimensions: { length: 30, width: 20, height: 25 },
      requiresShipping: true,
      shippingClass: 'standard'
    },
    tags: ['coffee', 'ceramic', 'kitchen', 'home'],
    status: 'active',
    isFeatured: false,
    rating: 4.8,
    numReviews: 94,
    reviews: {
      averageRating: 4.8,
      count: 94
    }
  },
  {
    name: 'Professional Makeup Brush Set',
    slug: 'professional-makeup-brush-set',
    description: 'Complete 15-piece professional makeup brush set with premium synthetic bristles.',
    shortDescription: 'Professional 15-piece makeup brush set',
    sku: 'PMB-005',
    brand: 'BeautyPro',
    images: [
      {
        url: 'https://picsum.photos/800/600?random=9',
        alt: 'Professional Makeup Brush Set',
        isMain: true
      },
      {
        url: 'https://picsum.photos/800/600?random=10',
        alt: 'Makeup Brushes Collection',
        isMain: false
      }
    ],
    variants: [
      {
        name: 'Default',
        sku: 'PMB-005-DEFAULT',
        price: 45.99,
        comparePrice: 69.99,
        cost: 22.00,
        weight: 0.8,
        dimensions: { length: 25, width: 15, height: 8 },
        inventory: {
          quantity: 120,
          trackQuantity: true,
          allowBackorder: false,
          lowStockThreshold: 20
        },
        attributes: [
          { name: 'Set Type', value: '15 Piece' }
        ],
        images: ['https://images.unsplash.com/photo-1596462502278-274cbbb4063e?w=800'],
        isActive: true
      }
    ],
    pricing: {
      basePrice: 45.99,
      price: 45.99,
      comparePrice: 69.99,
      cost: 22.00
    },
    inventory: {
      quantity: 120,
      trackQuantity: true,
      allowBackorder: false,
      lowStockThreshold: 20,
      reserved: 0
    },
    isActive: true,
    shipping: {
      weight: 0.8,
      dimensions: { length: 25, width: 15, height: 8 },
      requiresShipping: true,
      shippingClass: 'standard'
    },
    tags: ['makeup', 'brushes', 'beauty', 'cosmetics'],
    status: 'active',
    featured: true,
    rating: 4.4,
    numReviews: 203,
    reviews: {
      averageRating: 4.4,
      count: 203
    }
  }
];

// Sample categories
const sampleCategories = [
  {
    name: 'Electronics',
    slug: 'electronics',
    path: 'electronics',
    description: 'Latest gadgets and electronic devices',
    image: {
      url: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800',
      alt: 'Electronics category'
    },
    icon: '📱',
    parent: null,
    isActive: true,
    sortOrder: 1
  },
  {
    name: 'Fashion',
    slug: 'fashion',
    path: 'fashion',
    description: 'Trendy clothing and accessories',
    image: {
      url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
      alt: 'Fashion category'
    },
    icon: '👔',
    parent: null,
    isActive: true,
    sortOrder: 2
  },
  {
    name: 'Home & Living',
    slug: 'home-living',
    path: 'home-living',
    description: 'Home decor and kitchen essentials',
    image: {
      url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
      alt: 'Home & Living category'
    },
    icon: '🏠',
    parent: null,
    isActive: true,
    sortOrder: 3
  },
  {
    name: 'Sports & Fitness',
    slug: 'sports',
    path: 'sports',
    description: 'Fitness equipment and sports gear',
    image: {
      url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
      alt: 'Sports & Fitness category'
    },
    icon: '💪',
    parent: null,
    isActive: true,
    sortOrder: 4
  },
  {
    name: 'Beauty & Personal Care',
    slug: 'beauty',
    path: 'beauty',
    description: 'Cosmetics and personal care products',
    image: {
      url: 'https://images.unsplash.com/photo-1596462502278-274cbbb4063e?w=800',
      alt: 'Beauty & Personal Care category'
    },
    icon: '💄',
    parent: null,
    isActive: true,
    sortOrder: 5
  }
];

// Sample supplier
const sampleSupplier = {
  name: 'Global Suppliers Inc',
  slug: 'global-suppliers-inc',
  description: 'A leading global supplier of quality products',
  contact: {
    email: 'contact@globalsuppliers.com',
    phone: '+1-555-0123',
    address: {
      street: '123 Supplier Street',
      city: 'Commerce City',
      state: 'CA',
      zipCode: '12345',
      country: 'USA'
    }
  },
  performance: {
    totalOrders: 1250,
    successfulOrders: 1200,
    failedOrders: 50,
    averageProcessingTime: 24,
    averageShippingTime: 3,
    rating: {
      average: 4.8,
      count: 450
    }
  },
  pricing: {
    commissionRate: 10,
    shippingRates: [
      {
        method: 'standard',
        baseRate: 5.99,
        perItemRate: 1.99,
        freeShippingThreshold: 50
      },
      {
        method: 'express',
        baseRate: 12.99,
        perItemRate: 2.99,
        freeShippingThreshold: 100
      }
    ]
  },
  integration: {
    type: 'manual',
    autoSync: false,
    syncFrequency: 24
  },
  isActive: true
};

async function seedDatabase() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dropship_ecommerce');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Supplier.deleteMany({});
    console.log('Cleared existing data');

    // Insert supplier first
    const supplier = await Supplier.create(sampleSupplier);
    console.log('Created supplier:', supplier.name);

    // Insert categories
    const categories = await Category.insertMany(sampleCategories);
    console.log(`Created ${categories.length} categories`);

    // Create category lookup map
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.slug] = cat._id;
    });

    // Update products with category references and supplier
    const productsWithRefs = sampleProducts.map((product, index) => {
      let categorySlug = 'electronics'; // default
      
      // Assign categories based on product type
      if (index === 0 || index === 1) {
        categorySlug = 'electronics'; // Headphones, Smart Watch
      } else if (index === 2) {
        categorySlug = 'sports'; // Yoga Mat
      } else if (index === 3) {
        categorySlug = 'home-living'; // Coffee Maker
      } else if (index === 4) {
        categorySlug = 'beauty'; // Makeup Brushes
      }
      
      return {
        ...product,
        category: categoryMap[categorySlug],
        supplier: supplier._id
      };
    });

    // Insert products
    const products = await Product.insertMany(productsWithRefs);
    console.log(`Created ${products.length} products`);

    console.log('Database seeded successfully!');
    
    // Close connection
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
