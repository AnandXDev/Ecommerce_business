export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  images: Array<{ url: string; alt: string }>;
  pricing: {
    price: number;
    comparePrice?: number | null;
    discountPercentage?: number | null;
  };
  category: {
    name: string;
    slug: string;
  };
  reviews: {
    averageRating: number;
    count: number;
  };
  inventory: {
    quantity: number;
    lowStockThreshold: number;
  };
  isFeatured: boolean;
  shipping: {
    freeShipping: boolean;
    estimatedDelivery: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  count?: number;
  createdAt: string;
  updatedAt: string;
}
