"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDashboardOverview, useRealTimeMetrics, formatCurrency, formatPercentage, getChangeColor, getChangeIcon } from '@/hooks/useAnalytics';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useOrders } from "@/hooks/useData";
import { 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp,
  TrendingDown,
  Activity,
  AlertCircle,
  RefreshCw,
  Download,
  Eye,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';

interface Order {
  _id: string;
  orderNumber: string;
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  items: Array<{
    _id: string;
    product: string;
    productSnapshot: {
      name: string;
      images: string[];
    };
    pricing: {
      total: number;
    };
    quantity: number;
    price: number;
    total: number;
  }>;
  pricing: {
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
  };
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentDetails?: {
    transactionId: string;
    paymentIntentId: string;
    gateway: string;
    amount: number;
    currency: string;
    paidAt: string;
  };
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
}

export default function AdminDashboard() {
  const { user, isAuthenticated, isAdmin, loading } = useAuth();
  const { data: overview, loading: overviewLoading, error: overviewError } = useDashboardOverview('30d', true);
  const {orders,loadingOrders, ordersError, refreshOrders} = useOrders();
  // const { data: realTime, loading: realTimeLoading, error: realTimeError } = useRealTimeMetrics(true);

  // Debug logging
  useEffect(() => {
    console.log('=== ADMIN DASHBOARD DEBUG ===');
    console.log('User:', user);
    console.log('Is Authenticated:', isAuthenticated);
    console.log('Is Admin:', isAdmin);
    console.log('User Role:', user?.role);
    console.log('Loading:', loading);
    console.log('=============================');
  }, [user, isAuthenticated, isAdmin, loading]);

  // Redirect if not admin
  useEffect(() => {
    if (!loading && !isAdmin) {
      console.log('Redirecting - not admin or still loading');
      window.location.href = '/';
    }
  }, [isAdmin, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  if (overviewLoading ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (overviewError ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{overviewError }</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const getMetricCard = (title: string, value: string | number, icon: React.ReactNode, change?: number, trend?: 'up' | 'down' | 'stable') => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {change !== undefined && (
              <div className={`flex items-center text-sm ${getChangeColor(change)}`}>
                {getChangeIcon(change)}
                <span className="ml-1">{Math.abs(change)}%</span>
              </div>
            )}
          </div>
          <div className="p-3 bg-primary/10 rounded-lg">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container-custom py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.firstName}. Here's what's happening with your store today.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Real-time Metrics */}
      {/* {realTime && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Real-time Metrics</h2>
            <Badge variant="secondary" className="text-xs">
              Last updated: {new Date(realTime.timestamp).toLocaleTimeString()}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {getMetricCard(
              "Today's Orders",
              realTime.today.orders,
              <ShoppingCart className="h-6 w-6 text-primary" />,
              realTime.comparison.orderChange
            )}
            {getMetricCard(
              "Today's Revenue",
              formatCurrency(realTime.today.revenue),
              <DollarSign className="h-6 w-6 text-primary" />,
              realTime.comparison.revenueChange
            )}
            {getMetricCard(
              "Active Users",
              realTime.today.activeUsers,
              <Users className="h-6 w-6 text-primary" />,
              undefined
            )}
            {getMetricCard(
              "Online Now",
              realTime.today.onlineUsers,
              <Activity className="h-6 w-6 text-primary" />,
              undefined
            )}
          </div>
        </div>
      )} */}

      {/* Overview Cards */}
      {overview && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {getMetricCard(
              "Total Users",
              overview.overview.totalUsers,
              <Users className="h-6 w-6 text-blue-600" />,
              undefined
            )}
            {getMetricCard(
              "Total Products",
              overview.overview.totalProducts,
              <Package className="h-6 w-6 text-green-600" />,
              undefined
            )}
            {getMetricCard(
              "Total Orders",
              overview.overview.totalOrders,
              <ShoppingCart className="h-6 w-6 text-purple-600" />,
              undefined
            )}
            {getMetricCard(
              "Total Revenue",
              formatCurrency(overview.overview.totalRevenue),
              <DollarSign className="h-6 w-6 text-yellow-600" />,
              undefined
            )}
          </div>
        </div>
      )}

      {/* Charts and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Trend */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                <div className="text-center text-muted-foreground">
                  <TrendingUp className="h-12 w-12 mx-auto mb-2" />
                  <p>Revenue chart would be displayed here</p>
                  <p className="text-sm">Integrate with Chart.js or Recharts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Products */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Top Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {overview?.topProducts.slice(0, 5).map((product, index) => (
                  <div key={product._id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium line-clamp-1">
                          {product.product.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {product.totalSold} sold
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        {formatCurrency(product.revenue)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Orders */}
<div className="mt-8">
  <Card>
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle>Recent Orders</CardTitle>
        <Button variant="outline" size="sm" onClick={refreshOrders}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
    </CardHeader>

    <CardContent>
      {/* ✅ Loading */}
      {loadingOrders && (
        <div className="text-center py-6 text-muted-foreground">
          Loading orders...
        </div>
      )}

      {/* ❌ Error */}
      {ordersError && (
        <div className="text-center py-6 text-red-500">
          Failed to load orders
        </div>
      )}

      {/* ✅ Empty */}
      {!loadingOrders && (!orders || orders.length === 0) && (
        <div className="text-center py-6 text-muted-foreground">
          No orders found
        </div>
      )}

      {/* ✅ Data */}
      {orders?.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-4 text-sm">Order ID</th>
                <th className="text-left py-2 px-4 text-sm">Customer</th>
                <th className="text-left py-2 px-4 text-sm">Total</th>
                <th className="text-left py-2 px-4 text-sm">Status</th>
                <th className="text-left py-2 px-4 text-sm">Date</th>
              </tr>
            </thead>

            <tbody>
              {orders.slice(0, 5).map((order) => (
                <tr key={order._id} className="border-b">

                  {/* Order ID */}
                  <td className="py-3 px-4">
                    <span className="font-mono text-sm">
                      {order.orderNumber || order._id}
                    </span>
                  </td>

                  {/* Customer */}
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm font-medium">
                        {order.user?.firstName || "N/A"} {order.user?.lastName || ""}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.user?.email || "No email"}
                      </p>
                    </div>
                  </td>

                  {/* Total */}
                  <td className="py-3 px-4">
                    <span className="font-semibold">
                      {formatCurrency(order.pricing?.total || 0)}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    <Badge
                      variant={
                        order.status === "delivered"
                          ? "default"
                          : order.status === "processing"
                          ? "secondary"
                          : order.status === "pending"
                          ? "outline"
                          : "destructive"
                      }
                    >
                      {order.status}
                    </Badge>
                  </td>

                  {/* Date */}
                  <td className="py-3 px-4">
                    <span className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </CardContent>
  </Card>
</div>

      {/* Quick Stats */}
      {overview && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Order Value</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(overview.overview.averageOrderValue)}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                  <p className="text-2xl font-bold">
                    {formatPercentage(overview.overview.conversionRate)}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Suppliers</p>
                  <p className="text-2xl font-bold">
                    {overview.overview.activeSuppliers}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Package className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">New Customers</p>
                  <p className="text-2xl font-bold">
                    {overview.overview.newUsers}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
