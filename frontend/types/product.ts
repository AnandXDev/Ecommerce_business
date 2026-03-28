export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  images: Array<{ url: string; alt: string; isMain?: boolean }>;
  pricing: {
    basePrice: number;
    comparePrice?: number | null;
    cost?: number;
    taxClass?: string;
  };
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  rating: {
    average: number;
    count: number;
  };
  inventory: {
    quantity: number;
    lowStockThreshold: number;
    reserved: number;
    available: number;
  };
  featured?: boolean;
  trending?: boolean;
  status: string;
  visibility: string;
  tags: string[];
  sku?: string;
  supplier?: {
    _id: string;
    name: string;
  };
  shipping?: {
    freeShipping?: boolean;
    estimatedDelivery?: string;
  };
  sales?: {
    total: number;
    count: number;
  };
  views?: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}
