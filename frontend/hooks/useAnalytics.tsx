'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

// Types
export interface DashboardOverview {
  overview: {
    totalUsers: number;
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    activeSuppliers: number;
    newUsers: number;
    newOrders: number;
    averageOrderValue: number;
    conversionRate: number;
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
  recentOrders: Array<{
    _id: string;
    orderId: string;
    total: number;
    status: string;
    createdAt: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
  }>;
  orderStatusBreakdown: Array<{
    _id: string;
    count: number;
  }>;
  salesByCategory: Array<{
    _id: string;
    revenue: number;
    orders: number;
  }>;
  trends: {
    revenue: Array<{
      _id: string;
      revenue: number;
      orders: number;
    }>;
    userGrowth: Array<{
      _id: string;
      count: number;
    }>;
  };
  topSuppliers: Array<{
    _id: string;
    name: string;
    revenue: number;
    orders: number;
  }>;
  period: string;
}

export interface RealTimeMetrics {
  today: {
    orders: number;
    revenue: number;
    newUsers: number;
    activeUsers: number;
    onlineUsers: number;
    cartAbandonmentRate: number;
    conversionRate: number;
  };
  comparison: {
    orderChange: number;
    revenueChange: number;
  };
  topProducts: any[];
  recentOrders: any[];
  systemHealth: {
    status: string;
    metrics: any;
    alerts: any[];
  };
  timestamp: string;
}

export interface SalesAnalytics {
  summary: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    repeatPurchaseRate: number;
    cartAbandonmentRate: number;
  };
  trends: any[];
  topProducts: any[];
  breakdown: {
    byCategory: any[];
    byPaymentMethod: any[];
    customerSegmentation: any[];
  };
  period: string;
}

export interface CustomerAnalytics {
  overview: {
    totalCustomers: number;
    newCustomers: number;
    activeCustomers: number;
    customerRetentionRate: number;
    averageLifetimeValue: number;
  };
  trends: any[];
  segmentation: any[];
  topCustomers: any[];
  geography: any[];
  behavior: any[];
  period: string;
}

export interface ProductAnalytics {
  overview: {
    totalProducts: number;
    activeProducts: number;
    lowStockProducts: number;
    outOfStockProducts: number;
    inventoryTurnover: number;
  };
  topSelling: any[];
  performance: any[];
  categoryPerformance: any[];
  metrics: {
    views: any[];
    conversionRates: any[];
  };
  period: string;
}

export interface OrderAnalytics {
  overview: {
    totalOrders: number;
    averageOrderValue: number;
    fulfillmentRate: number;
    returnRate: number;
  };
  breakdown: {
    byStatus: any[];
    byValue: any[];
  };
  metrics: {
    fulfillment: any;
    shipping: any;
    returns: any;
  };
  trends: any[];
  patterns: {
    peakTimes: any[];
    geographic: any[];
  };
  period: string;
}

export interface FinancialAnalytics {
  overview: {
    totalRevenue: number;
    totalCost: number;
    grossProfit: number;
    netProfit: number;
    profitMargin: number;
  };
  breakdown: {
    revenueBySource: any[];
    costs: any[];
    expenses: any[];
  };
  trends: {
    profit: any[];
    cashFlow: any[];
  };
  period: string;
}

// Hook for dashboard overview
export function useDashboardOverview(period: string = '30d', autoRefresh: boolean = false) {
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/analytics/dashboard?period=${period}`);
      setData(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [period]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh, period]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}

// Hook for real-time metrics
export function useRealTimeMetrics(autoRefresh: boolean = true) {
  const [data, setData] = useState<RealTimeMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('/api/analytics/realtime');
      setData(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch real-time metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchData, 10000); // Refresh every 10 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}

// Hook for sales analytics
export function useSalesAnalytics(period: string = '30d', groupBy: string = 'day') {
  const [data, setData] = useState<SalesAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/admin/analytics/sales?period=${period}&groupBy=${groupBy}`);
      setData(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch sales analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [period, groupBy]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}

// Hook for customer analytics
export function useCustomerAnalytics(period: string = '30d') {
  const [data, setData] = useState<CustomerAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/admin/analytics/customers?period=${period}`);
      setData(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch customer analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [period]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}

// Hook for product analytics
export function useProductAnalytics(period: string = '30d') {
  const [data, setData] = useState<ProductAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/admin/analytics/products?period=${period}`);
      setData(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch product analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [period]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}

// Hook for order analytics
export function useOrderAnalytics(period: string = '30d') {
  const [data, setData] = useState<OrderAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/admin/analytics/orders?period=${period}`);
      setData(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch order analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [period]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}

// Hook for financial analytics
export function useFinancialAnalytics(period: string = '30d') {
  const [data, setData] = useState<FinancialAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/admin/analytics/financial?period=${period}`);
      setData(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch financial analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [period]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}

// Export analytics data
export async function exportAnalytics(type: string, period: string = '30d', format: string = 'json') {
  try {
    const response = await axios.get(`/api/admin/analytics/export?type=${type}&period=${period}&format=${format}`, {
      responseType: format === 'csv' ? 'blob' : 'json'
    });

    if (format === 'csv') {
      // Create download link for CSV
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}-analytics-${period}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } else {
      // Download JSON
      const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}-analytics-${period}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    }

    return true;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to export analytics');
  }
}

// Generate custom report
export async function generateCustomReport(
  metrics: string[],
  startDate: string,
  endDate: string,
  groupBy: string = 'day',
  filters: any = {}
) {
  try {
    const response = await axios.post('/api/admin/analytics/custom', {
      metrics,
      startDate,
      endDate,
      groupBy,
      filters
    });

    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to generate custom report');
  }
}

// Utility functions
export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

export function formatPercentage(value: number) {
  return `${value.toFixed(1)}%`;
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US').format(value);
}

export function getChangeColor(change: number) {
  if (change > 0) return 'text-green-600';
  if (change < 0) return 'text-red-600';
  return 'text-gray-600';
}

export function getChangeIcon(change: number) {
  return change > 0 ? '↑' : change < 0 ? '↓' : '→';
}

export function getTrendIcon(trend: 'up' | 'down' | 'stable') {
  switch (trend) {
    case 'up':
      return '📈';
    case 'down':
      return '📉';
    default:
      return '➡️';
  }
}

export function getStatusColor(status: string) {
  switch (status) {
    case 'healthy':
      return 'text-green-600';
    case 'warning':
      return 'text-yellow-600';
    case 'error':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
}
