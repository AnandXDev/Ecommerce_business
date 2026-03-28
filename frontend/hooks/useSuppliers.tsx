'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

// Types
export interface Supplier {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  integrationType: 'aliexpress' | 'shopify' | 'custom';
  description?: string;
  website?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  categories: Array<{
    _id: string;
    name: string;
    slug: string;
  }>;
  settings: {
    autoSync: boolean;
    syncInterval: number;
    markupPercentage: number;
  };
  credentials?: {
    apiKey?: string;
    accessToken?: string;
    apiSecret?: string;
  };
  shopDomain?: string;
  isActive: boolean;
  productCount?: number;
  orderCount?: number;
  lastSyncAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierAnalytics {
  summary: {
    totalOrders: number;
    totalRevenue: number;
    totalProducts: number;
    averageOrderValue: number;
  };
  topProducts: Array<{
    _id: string;
    totalSold: number;
    revenue: number;
    product: {
      name: string;
      slug: string;
      images: Array<{ url: string; alt: string }>;
    };
  }>;
  orderStatusBreakdown: Array<{
    _id: string;
    count: number;
  }>;
  trends: {
    dailyOrders: Array<{
      _id: string;
      count: number;
    }>;
    monthlyRevenue: Array<{
      _id: string;
      revenue: number;
      orders: number;
    }>;
  };
  period: string;
}

export interface SupplierPerformance {
  fulfillmentRate: number;
  averageProcessingTime: number;
  returnRate: number;
  customerSatisfaction: number;
  onTimeDeliveryRate: number;
}

interface UseSuppliersOptions {
  page?: number;
  limit?: number;
  search?: string;
  integrationType?: string;
  isActive?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function useSuppliers(options: UseSuppliersOptions = {}) {
  const {
    page = 1,
    limit = 20,
    search,
    integrationType,
    isActive,
    autoRefresh = false,
    refreshInterval = 30000 // 30 seconds
  } = options;

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });

  const fetchSuppliers = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(integrationType && { integrationType }),
        ...(isActive !== undefined && { isActive: isActive.toString() })
      });

      const response = await axios.get(`/api/admin/suppliers?${params}`);
      
      setSuppliers(response.data.data.suppliers);
      setPagination(response.data.data.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch suppliers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, [page, limit, search, integrationType, isActive]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchSuppliers, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  return {
    suppliers,
    loading,
    error,
    pagination,
    refetch: fetchSuppliers
  };
}

export function useSupplier(id: string) {
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSupplier = async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/admin/suppliers/${id}`);
      setSupplier(response.data.data.supplier);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch supplier');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupplier();
  }, [id]);

  return {
    supplier,
    loading,
    error,
    refetch: fetchSupplier
  };
}

export function useSupplierAnalytics(id: string, period: string = '30d') {
  const [analytics, setAnalytics] = useState<SupplierAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/admin/suppliers/${id}/analytics?period=${period}`);
      setAnalytics(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [id, period]);

  return {
    analytics,
    loading,
    error,
    refetch: fetchAnalytics
  };
}

export function useSupplierPerformance(id: string) {
  const [performance, setPerformance] = useState<SupplierPerformance | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPerformance = async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/admin/suppliers/${id}/performance`);
      setPerformance(response.data.data.metrics);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch performance metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformance();
  }, [id]);

  return {
    performance,
    loading,
    error,
    refetch: fetchPerformance
  };
}

// Supplier management functions
export async function createSupplier(supplierData: Partial<Supplier>) {
  try {
    const response = await axios.post('/api/admin/suppliers', supplierData);
    return response.data.data.supplier;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create supplier');
  }
}

export async function updateSupplier(id: string, supplierData: Partial<Supplier>) {
  try {
    const response = await axios.patch(`/api/admin/suppliers/${id}`, supplierData);
    return response.data.data.supplier;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update supplier');
  }
}

export async function deleteSupplier(id: string) {
  try {
    await axios.delete(`/api/admin/suppliers/${id}`);
    return true;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete supplier');
  }
}

export async function syncSupplierProducts(id: string) {
  try {
    const response = await axios.post(`/api/admin/suppliers/${id}/sync`);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to sync products');
  }
}

export async function updateSupplierInventory(id: string) {
  try {
    const response = await axios.post(`/api/admin/suppliers/${id}/inventory`);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update inventory');
  }
}

export async function placeSupplierOrder(id: string, orderData: any) {
  try {
    const response = await axios.post(`/api/admin/suppliers/${id}/orders`, { orderData });
    return response.data.data.supplierOrder;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to place order');
  }
}

export async function getOrderTracking(id: string, supplierOrderId: string) {
  try {
    const response = await axios.get(`/api/admin/suppliers/${id}/orders/${supplierOrderId}/tracking`);
    return response.data.data.tracking;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get tracking information');
  }
}

// Utility functions
export function getIntegrationIcon(integrationType: string) {
  switch (integrationType) {
    case 'aliexpress':
      return '🛒';
    case 'shopify':
      return '🏪';
    case 'custom':
      return '⚙️';
    default:
      return '📦';
  }
}

export function getIntegrationName(integrationType: string) {
  switch (integrationType) {
    case 'aliexpress':
      return 'AliExpress';
    case 'shopify':
      return 'Shopify Dropshipping';
    case 'custom':
      return 'Custom API';
    default:
      return 'Unknown';
  }
}

export function formatPerformanceMetric(value: number, type: string) {
  switch (type) {
    case 'percentage':
      return `${value.toFixed(1)}%`;
    case 'time':
      return `${value.toFixed(0)}h`;
    case 'rating':
      return `${value.toFixed(1)}★`;
    default:
      return value.toString();
  }
}

export function getPerformanceColor(value: number, type: string) {
  switch (type) {
    case 'percentage':
      if (value >= 90) return 'text-green-600';
      if (value >= 70) return 'text-yellow-600';
      return 'text-red-600';
    case 'time':
      if (value <= 24) return 'text-green-600';
      if (value <= 48) return 'text-yellow-600';
      return 'text-red-600';
    case 'rating':
      if (value >= 4.5) return 'text-green-600';
      if (value >= 3.5) return 'text-yellow-600';
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
}
