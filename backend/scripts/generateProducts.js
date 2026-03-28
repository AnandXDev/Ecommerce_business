const categories = ['Fitness', 'Electronics', 'Clothing', 'Home', 'Beauty'];

const brands = ['EcoFit', 'Nike', 'Adidas', 'Sony', 'Apple', 'Samsung'];

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateProduct(index) {
  const price = (Math.random() * 100 + 10).toFixed(2);
  const comparePrice = (price * 1.3).toFixed(2);

  return {
    name: `Product ${index}`,
    slug: `product-${index}`,
    description: `High-quality product number ${index} with premium features.`,
    shortDescription: `Premium product ${index}`,
    sku: `SKU-${index}`,
    brand: randomFrom(brands),

    images: [
      {
        url: `https://picsum.photos/800/600?random=${index}`,
        alt: `Product ${index}`,
        isMain: true
      }
    ],

    variants: [
      {
        name: 'Default',
        sku: `SKU-${index}-DEFAULT`,
        price: Number(price),
        comparePrice: Number(comparePrice),
        cost: Number((price * 0.6).toFixed(2)),
        weight: 1,
        dimensions: { length: 10, width: 10, height: 5 },
        inventory: {
          quantity: Math.floor(Math.random() * 200),
          trackQuantity: true,
          allowBackorder: false,
          lowStockThreshold: 10
        },
        attributes: [
          { name: 'Color', value: randomFrom(['Red', 'Blue', 'Black']) }
        ],
        images: [`https://picsum.photos/800/600?random=${index}`],
        isActive: true
      }
    ],

    pricing: {
      basePrice: Number(price),
      price: Number(price),
      comparePrice: Number(comparePrice),
      cost: Number((price * 0.6).toFixed(2))
    },

    inventory: {
      quantity: Math.floor(Math.random() * 200),
      trackQuantity: true,
      allowBackorder: false,
      lowStockThreshold: 10,
      reserved: 0
    },

    isActive: true,

    shipping: {
      weight: 1,
      dimensions: { length: 10, width: 10, height: 5 },
      requiresShipping: true,
      shippingClass: 'standard'
    },

    tags: ['ecommerce', 'product'],
    status: 'active',
    isFeatured: Math.random() > 0.8,
    rating: (Math.random() * 5).toFixed(1),
    numReviews: Math.floor(Math.random() * 500),

    reviews: {
      averageRating: (Math.random() * 5).toFixed(1),
      count: Math.floor(Math.random() * 500)
    }
  };
}

// Generate 100 products
const products = [];

for (let i = 1; i <= 100; i++) {
  products.push(generateProduct(i));
}

module.exports = products;