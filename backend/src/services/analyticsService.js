const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Supplier = require('../models/Supplier');
const Category = require('../models/Category');

class AnalyticsService {
  // Get dashboard overview statistics
  async getDashboardOverview(period = '30d') {
    try {
      const startDate = this.getStartDate(period);
      
      const [
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        activeSuppliers,
        newUsers,
        newOrders,
        topProducts,
        recentOrders,
        orderStatusBreakdown,
        salesByCategory,
        revenueTrend,
        userGrowthTrend,
        topSuppliers
      ] = await Promise.all([
        // Total counts
        User.countDocuments({ isActive: true }),
        Product.countDocuments({ isActive: true }),
        Order.countDocuments({ createdAt: { $gte: startDate } }),
        this.getTotalRevenue(startDate),
        Supplier.countDocuments({ isActive: true }),
        
        // New users in period
        User.countDocuments({ createdAt: { $gte: startDate } }),
        
        // New orders in period
        Order.countDocuments({ createdAt: { $gte: startDate } }),
        
        // Top products
        this.getTopProducts(startDate, 5),
        
        // Recent orders
        Order.find({ createdAt: { $gte: startDate } })
          .sort({ createdAt: -1 })
          .limit(10)
          .populate('user', 'firstName lastName email')
          .select('orderId total status createdAt user'),
        
        // Order status breakdown
        this.getOrderStatusBreakdown(startDate),
        
        // Sales by category
        this.getSalesByCategory(startDate),
        
        // Revenue trend
        this.getRevenueTrend(startDate),
        
        // User growth trend
        this.getUserGrowthTrend(startDate),
        
        // Top suppliers
        this.getTopSuppliers(startDate, 5)
      ]);

      return {
        overview: {
          totalUsers,
          totalProducts,
          totalOrders,
          totalRevenue,
          activeSuppliers,
          newUsers,
          newOrders,
          averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
          conversionRate: await this.getConversionRate(startDate)
        },
        topProducts,
        recentOrders,
        orderStatusBreakdown,
        salesByCategory,
        trends: {
          revenue: revenueTrend,
          userGrowth: userGrowthTrend
        },
        topSuppliers,
        period
      };
    } catch (error) {
      throw new Error(`Failed to get dashboard overview: ${error.message}`);
    }
  }

  // Get sales analytics
  async getSalesAnalytics(period = '30d', groupBy = 'day') {
    try {
      const startDate = this.getStartDate(period);
      
      const [
        totalRevenue,
        totalOrders,
        averageOrderValue,
        salesTrend,
        topProducts,
        salesByCategory,
        salesByPaymentMethod,
        customerSegmentation,
        repeatPurchaseRate,
        cartAbandonmentRate
      ] = await Promise.all([
        this.getTotalRevenue(startDate),
        Order.countDocuments({ createdAt: { $gte: startDate } }),
        this.getAverageOrderValue(startDate),
        this.getSalesTrend(startDate, groupBy),
        this.getTopProducts(startDate, 10),
        this.getSalesByCategory(startDate),
        this.getSalesByPaymentMethod(startDate),
        this.getCustomerSegmentation(startDate),
        this.getRepeatPurchaseRate(startDate),
        this.getCartAbandonmentRate(startDate)
      ]);

      return {
        summary: {
          totalRevenue,
          totalOrders,
          averageOrderValue,
          repeatPurchaseRate,
          cartAbandonmentRate
        },
        trends: salesTrend,
        topProducts,
        breakdown: {
          byCategory: salesByCategory,
          byPaymentMethod: salesByPaymentMethod,
          customerSegmentation
        },
        period
      };
    } catch (error) {
      throw new Error(`Failed to get sales analytics: ${error.message}`);
    }
  }

  // Get customer analytics
  async getCustomerAnalytics(period = '30d') {
    try {
      const startDate = this.getStartDate(period);
      
      const [
        totalCustomers,
        newCustomers,
        activeCustomers,
        customerGrowth,
        customerSegmentation,
        customerLifetimeValue,
        customerRetentionRate,
        topCustomers,
        customerGeography,
        customerBehavior
      ] = await Promise.all([
        User.countDocuments({ isActive: true }),
        User.countDocuments({ createdAt: { $gte: startDate } }),
        this.getActiveCustomers(startDate),
        this.getCustomerGrowth(startDate),
        this.getCustomerSegmentation(startDate),
        this.getCustomerLifetimeValue(startDate),
        this.getCustomerRetentionRate(startDate),
        this.getTopCustomers(startDate, 10),
        this.getCustomerGeography(startDate),
        this.getCustomerBehavior(startDate)
      ]);

      return {
        overview: {
          totalCustomers,
          newCustomers,
          activeCustomers,
          customerRetentionRate,
          averageLifetimeValue: customerLifetimeValue
        },
        trends: customerGrowth,
        segmentation: customerSegmentation,
        topCustomers,
        geography: customerGeography,
        behavior: customerBehavior,
        period
      };
    } catch (error) {
      throw new Error(`Failed to get customer analytics: ${error.message}`);
    }
  }

  // Get product analytics
  async getProductAnalytics(period = '30d') {
    try {
      const startDate = this.getStartDate(period);
      
      const [
        totalProducts,
        activeProducts,
        lowStockProducts,
        outOfStockProducts,
        topSellingProducts,
        productPerformance,
        categoryPerformance,
        inventoryTurnover,
        productViews,
        conversionRates
      ] = await Promise.all([
        Product.countDocuments(),
        Product.countDocuments({ isActive: true }),
        Product.countDocuments({ 
          isActive: true, 
          'inventory.quantity': { $lte: 10 } 
        }),
        Product.countDocuments({ 
          isActive: true, 
          'inventory.quantity': 0 
        }),
        this.getTopSellingProducts(startDate, 10),
        this.getProductPerformance(startDate),
        this.getCategoryPerformance(startDate),
        this.getInventoryTurnover(startDate),
        this.getProductViews(startDate),
        this.getProductConversionRates(startDate)
      ]);

      return {
        overview: {
          totalProducts,
          activeProducts,
          lowStockProducts,
          outOfStockProducts,
          inventoryTurnover
        },
        topSelling: topSellingProducts,
        performance: productPerformance,
        categoryPerformance,
        metrics: {
          views: productViews,
          conversionRates
        },
        period
      };
    } catch (error) {
      throw new Error(`Failed to get product analytics: ${error.message}`);
    }
  }

  // Get order analytics
  async getOrderAnalytics(period = '30d') {
    try {
      const startDate = this.getStartDate(period);
      
      const [
        totalOrders,
        orderStatusBreakdown,
        orderValueDistribution,
        fulfillmentMetrics,
        shippingAnalytics,
        returnsAnalytics,
        orderTrends,
        peakOrderTimes,
        geographicDistribution
      ] = await Promise.all([
        Order.countDocuments({ createdAt: { $gte: startDate } }),
        this.getOrderStatusBreakdown(startDate),
        this.getOrderValueDistribution(startDate),
        this.getFulfillmentMetrics(startDate),
        this.getShippingAnalytics(startDate),
        this.getReturnsAnalytics(startDate),
        this.getOrderTrends(startDate),
        this.getPeakOrderTimes(startDate),
        this.getGeographicDistribution(startDate)
      ]);

      return {
        overview: {
          totalOrders,
          averageOrderValue: await this.getAverageOrderValue(startDate),
          fulfillmentRate: fulfillmentMetrics.fulfillmentRate,
          returnRate: returnsAnalytics.returnRate
        },
        breakdown: {
          byStatus: orderStatusBreakdown,
          byValue: orderValueDistribution
        },
        metrics: {
          fulfillment: fulfillmentMetrics,
          shipping: shippingAnalytics,
          returns: returnsAnalytics
        },
        trends: orderTrends,
        patterns: {
          peakTimes: peakOrderTimes,
          geographic: geographicDistribution
        },
        period
      };
    } catch (error) {
      throw new Error(`Failed to get order analytics: ${error.message}`);
    }
  }

  // Get financial analytics
  async getFinancialAnalytics(period = '30d') {
    try {
      const startDate = this.getStartDate(period);
      
      const [
        totalRevenue,
        totalCost,
        grossProfit,
        netProfit,
        profitMargin,
        revenueBySource,
        costBreakdown,
        profitTrend,
        cashFlow,
        expensesBreakdown
      ] = await Promise.all([
        this.getTotalRevenue(startDate),
        this.getTotalCost(startDate),
        this.getGrossProfit(startDate),
        this.getNetProfit(startDate),
        this.getProfitMargin(startDate),
        this.getRevenueBySource(startDate),
        this.getCostBreakdown(startDate),
        this.getProfitTrend(startDate),
        this.getCashFlow(startDate),
        this.getExpensesBreakdown(startDate)
      ]);

      return {
        overview: {
          totalRevenue,
          totalCost,
          grossProfit,
          netProfit,
          profitMargin
        },
        breakdown: {
          revenueBySource,
          costs: costBreakdown,
          expenses: expensesBreakdown
        },
        trends: {
          profit: profitTrend,
          cashFlow
        },
        period
      };
    } catch (error) {
      throw new Error(`Failed to get financial analytics: ${error.message}`);
    }
  }

  // Helper methods
  getStartDate(period) {
    const now = new Date();
    switch (period) {
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case '30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case '90d':
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      case '1y':
        return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
  }

  async getTotalRevenue(startDate) {
    const result = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    return result[0]?.total || 0;
  }

  async getTotalCost(startDate) {
    const result = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.productId',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $group: {
          _id: null,
          totalCost: { $sum: { $multiply: ['$items.quantity', '$product.pricing.cost'] } }
        }
      }
    ]);
    return result[0]?.totalCost || 0;
  }

  async getAverageOrderValue(startDate) {
    const result = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: null,
          avgOrderValue: { $avg: '$total' }
        }
      }
    ]);
    return result[0]?.avgOrderValue || 0;
  }

  async getTopProducts(startDate, limit = 5) {
    return await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' }
    ]);
  }

  async getOrderStatusBreakdown(startDate) {
    return await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
  }

  async getSalesByCategory(startDate) {
    return await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.productId',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $lookup: {
          from: 'categories',
          localField: 'product.category',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: '$category' },
      {
        $group: {
          _id: '$category.name',
          revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
          orders: { $sum: 1 }
        }
      },
      { $sort: { revenue: -1 } }
    ]);
  }

  async getRevenueTrend(startDate) {
    return await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt'
            }
          },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
  }

  async getUserGrowthTrend(startDate) {
    return await User.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt'
            }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
  }

  async getTopSuppliers(startDate, limit = 5) {
    return await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'suppliers',
          localField: 'items.supplier',
          foreignField: '_id',
          as: 'supplier'
        }
      },
      { $unwind: '$supplier' },
      {
        $group: {
          _id: '$supplier._id',
          name: { $first: '$supplier.name' },
          revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
          orders: { $sum: 1 }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: limit }
    ]);
  }

  async getConversionRate(startDate) {
    const [totalVisitors, totalOrders] = await Promise.all([
      // Mock data - in real implementation, track visitors
      10000,
      Order.countDocuments({ createdAt: { $gte: startDate } })
    ]);
    
    return totalVisitors > 0 ? (totalOrders / totalVisitors) * 100 : 0;
  }

  // Additional helper methods for other analytics...
  async getActiveCustomers(startDate) {
    return await User.countDocuments({
      lastLoginAt: { $gte: startDate },
      isActive: true
    });
  }

  async getCustomerSegmentation(startDate) {
    // Mock segmentation - implement based on your business logic
    return [
      { segment: 'New', count: 100, percentage: 20 },
      { segment: 'Returning', count: 300, percentage: 60 },
      { segment: 'VIP', count: 100, percentage: 20 }
    ];
  }

  async getCustomerLifetimeValue(startDate) {
    const result = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: '$user',
          totalSpent: { $sum: '$total' }
        }
      },
      {
        $group: {
          _id: null,
          avgLifetimeValue: { $avg: '$totalSpent' }
        }
      }
    ]);
    return result[0]?.avgLifetimeValue || 0;
  }

  // Additional methods would be implemented similarly...
  async getCustomerRetentionRate(startDate) { return 75; }
  async getTopCustomers(startDate, limit) { return []; }
  async getCustomerGeography(startDate) { return []; }
  async getCustomerBehavior(startDate) { return []; }
  async getCustomerGrowth(startDate) { return []; }
  async getSalesTrend(startDate, groupBy) { return []; }
  async getSalesByPaymentMethod(startDate) { return []; }
  async getRepeatPurchaseRate(startDate) { return 35; }
  async getCartAbandonmentRate(startDate) { return 25; }
  async getTopSellingProducts(startDate, limit) { return []; }
  async getProductPerformance(startDate) { return []; }
  async getCategoryPerformance(startDate) { return []; }
  async getInventoryTurnover(startDate) { return 4.5; }
  async getProductViews(startDate) { return []; }
  async getProductConversionRates(startDate) { return []; }
  async getOrderValueDistribution(startDate) { return []; }
  async getFulfillmentMetrics(startDate) { return { fulfillmentRate: 95 }; }
  async getShippingAnalytics(startDate) { return []; }
  async getReturnsAnalytics(startDate) { return { returnRate: 5 }; }
  async getOrderTrends(startDate) { return []; }
  async getPeakOrderTimes(startDate) { return []; }
  async getGeographicDistribution(startDate) { return []; }
  async getGrossProfit(startDate) { return 50000; }
  async getNetProfit(startDate) { return 30000; }
  async getProfitMargin(startDate) { return 30; }
  async getRevenueBySource(startDate) { return []; }
  async getCostBreakdown(startDate) { return []; }
  async getProfitTrend(startDate) { return []; }
  async getCashFlow(startDate) { return []; }
  async getExpensesBreakdown(startDate) { return []; }
}

module.exports = new AnalyticsService();
