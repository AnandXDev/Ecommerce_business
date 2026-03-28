// Mock analytics service for development
class MockAnalyticsService {
  // Get dashboard overview statistics
  async getDashboardOverview(period = '30d') {
    return {
      overview: {
        totalUsers: 1250,
        totalProducts: 156,
        totalOrders: 892,
        totalRevenue: 125450,
        activeSuppliers: 24,
        newUsers: 89,
        newOrders: 156,
        averageOrderValue: 140.75,
        conversionRate: 3.2
      },
      topProducts: [
        {
          _id: '1',
          totalSold: 45,
          revenue: 4499.55,
          product: {
            name: 'Wireless Bluetooth Headphones',
            slug: 'wireless-headphones',
            images: [{ url: '/images/headphones.jpg', alt: 'Headphones' }]
          }
        },
        {
          _id: '2',
          totalSold: 32,
          revenue: 9599.68,
          product: {
            name: 'Smart Watch Pro',
            slug: 'smart-watch',
            images: [{ url: '/images/watch.jpg', alt: 'Smart Watch' }]
          }
        },
        {
          _id: '3',
          totalSold: 28,
          revenue: 1399.72,
          product: {
            name: 'Laptop Stand',
            slug: 'laptop-stand',
            images: [{ url: '/images/stand.jpg', alt: 'Laptop Stand' }]
          }
        }
      ],
      recentOrders: [
        {
          _id: '1',
          orderId: 'ORD-2024-001',
          total: 299.99,
          status: 'delivered',
          createdAt: new Date().toISOString(),
          user: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com'
          }
        },
        {
          _id: '2',
          orderId: 'ORD-2024-002',
          total: 149.99,
          status: 'processing',
          createdAt: new Date().toISOString(),
          user: {
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane@example.com'
          }
        }
      ],
      orderStatusBreakdown: [
        { _id: 'pending', count: 45 },
        { _id: 'processing', count: 23 },
        { _id: 'shipped', count: 67 },
        { _id: 'delivered', count: 756 },
        { _id: 'cancelled', count: 1 }
      ],
      salesByCategory: [
        { _id: 'Electronics', revenue: 45000, orders: 234 },
        { _id: 'Accessories', revenue: 32000, orders: 456 },
        { _id: 'Clothing', revenue: 28000, orders: 123 }
      ]
    };
  }

  // Get real-time metrics
  async getRealTimeMetrics() {
    return {
      today: {
        orders: 12,
        revenue: 1845.50,
        activeUsers: 45,
        onlineUsers: 8
      },
      comparison: {
        orderChange: 15.5,
        revenueChange: 8.2
      },
      timestamp: new Date().toISOString()
    };
  }

  // Get sales analytics
  async getSalesAnalytics(period = '30d', groupBy = 'day') {
    return {
      data: [],
      summary: {
        totalRevenue: 125450,
        totalOrders: 892,
        averageOrderValue: 140.75
      }
    };
  }

  // Get customer analytics
  async getCustomerAnalytics(period = '30d') {
    return {
      totalCustomers: 1250,
      newCustomers: 89,
      returningCustomers: 1161,
      customerRetentionRate: 92.8
    };
  }

  // Get product analytics
  async getProductAnalytics(period = '30d') {
    return {
      topProducts: [],
      lowStock: [],
      categoryPerformance: []
    };
  }

  // Get order analytics
  async getOrderAnalytics(period = '30d') {
    return {
      totalOrders: 892,
      orderStatusBreakdown: [],
      averageOrderValue: 140.75
    };
  }

  // Get financial analytics
  async getFinancialAnalytics(period = '30d') {
    return {
      totalRevenue: 125450,
      totalProfit: 37500,
      profitMargin: 29.9,
      expenses: 87950
    };
  }

  // Export analytics
  async exportAnalytics(type, period, format) {
    return {
      data: [],
      filename: `analytics-${type}-${period}.${format}`
    };
  }

  // Get custom report
  async getCustomReport(reportConfig) {
    return {
      data: [],
      metadata: reportConfig
    };
  }
}

module.exports = new MockAnalyticsService();
