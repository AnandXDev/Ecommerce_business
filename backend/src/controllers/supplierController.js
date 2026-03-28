const Supplier = require('../models/Supplier');
const Product = require('../models/Product');
const Order = require('../models/Order');
const supplierService = require('../services/supplierService');
const { validationResult } = require('express-validator');
const asyncHandler = require('../middleware/asyncHandler');

// Get all suppliers
exports.getSuppliers = asyncHandler(async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, integrationType, isActive } = req.query;

    // Build query
    const query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (integrationType) {
      query.integrationType = integrationType;
    }
    
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    // Pagination
    const skip = (page - 1) * limit;

    const [suppliers, total] = await Promise.all([
      Supplier.find(query)
        .sort({ name: 1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('categories', 'name slug'),
      Supplier.countDocuments(query)
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        suppliers,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get single supplier
exports.getSupplier = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;

    const supplier = await Supplier.findById(id)
      .populate('categories', 'name slug');

    if (!supplier) {
      return res.status(404).json({
        status: 'fail',
        message: 'Supplier not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: supplier
    });
  } catch (error) {
    next(error);
  }
});

// Create supplier
exports.createSupplier = asyncHandler(async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'fail',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const supplier = await Supplier.create(req.body);

    res.status(201).json({
      status: 'success',
      data: supplier
    });
  } catch (error) {
    next(error);
  }
});

// Update supplier
exports.updateSupplier = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'fail',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const supplier = await Supplier.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    ).populate('categories', 'name slug');

    if (!supplier) {
      return res.status(404).json({
        status: 'fail',
        message: 'Supplier not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: supplier
    });
  } catch (error) {
    next(error);
  }
});

// Delete supplier
exports.deleteSupplier = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;

    const supplier = await Supplier.findById(id);
    if (!supplier) {
      return res.status(404).json({
        status: 'fail',
        message: 'Supplier not found'
      });
    }

    // Check if supplier has products
    const productCount = await Product.countDocuments({ supplier: id });
    if (productCount > 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'Cannot delete supplier with existing products'
      });
    }

    await Supplier.findByIdAndDelete(id);

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
});

// Sync products from supplier
exports.syncSupplierProducts = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;

    const products = await supplierService.syncProductsFromSupplier(id);

    res.status(200).json({
      status: 'success',
      message: `Successfully synced ${products.length} products`,
      data: {
        syncedProducts: products.length,
        products
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get supplier products
exports.getSupplierProducts = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20, search, isActive } = req.query;

    // Build query
    const query = { supplier: id };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'inventory.sku': { $regex: search, $options: 'i' } }
      ];
    }
    
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    // Pagination
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name slug')
        .sort({ name: 1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Product.countDocuments(query)
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Update supplier inventory
exports.updateSupplierInventory = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;

    const inventoryUpdates = await supplierService.updateInventoryFromSupplier(id);

    res.status(200).json({
      status: 'success',
      message: `Successfully updated ${inventoryUpdates.length} inventory items`,
      data: {
        updatedItems: inventoryUpdates.length,
        inventoryUpdates
      }
    });
  } catch (error) {
    next(error);
  }
});

// Place order with supplier
exports.placeSupplierOrder = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    const { orderData } = req.body;

    const supplierOrder = await supplierService.placeOrderWithSupplier(id, orderData);

    res.status(200).json({
      status: 'success',
      message: 'Order placed successfully with supplier',
      data: {
        supplierOrder
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get order tracking from supplier
exports.getOrderTracking = asyncHandler(async (req, res, next) => {
  try {
    const { id, supplierOrderId } = req.params;

    const trackingInfo = await supplierService.getOrderTracking(id, supplierOrderId);

    res.status(200).json({
      status: 'success',
      data: {
        trackingInfo
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get supplier analytics
exports.getSupplierAnalytics = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    const { period = '30d' } = req.query;

    // Calculate date range based on period
    let startDate;
    switch (period) {
      case '7d':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get analytics data using aggregation pipeline
    const [
      totalOrders,
      totalRevenue,
      totalProducts,
      topProducts,
      orderStatusBreakdown,
      dailyOrders,
      monthlyRevenue
    ] = await Promise.all([
      // Total orders in period
      Order.countDocuments({
        'items.supplier': id,
        createdAt: { $gte: startDate }
      }),
      
      // Total revenue in period
      Order.aggregate([
        {
          $match: { 'items.supplier': id },
          $group: {
            _id: null,
            total: { $sum: '$totalAmount' }
          }
        }
      ]),
      
      // Total products from supplier
      Product.countDocuments({ supplier: id }),
      
      // Top products (mock data)
      Product.find({ supplier: id })
        .sort({ 'orderCount': -1 })
        .limit(5)
        .select('name sku images'),
      
      // Order status breakdown
      Order.aggregate([
        {
          $match: { 'items.supplier': id, createdAt: { $gte: startDate } },
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),
      
      // Daily orders (mock data)
      Order.aggregate([
        {
          $match: { 'items.supplier': id, createdAt: { $gte: startDate } },
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-%m-%d',
                timezone: 'UTC'
              }
            },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { _id: 1 }
        },
        {
          $limit: 30
        }
      ]),
      
      // Monthly revenue (mock data)
      Order.aggregate([
        {
          $match: { 'items.supplier': id, createdAt: { $gte: startDate } },
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-%m',
                timezone: 'UTC'
              }
            },
            total: { $sum: '$totalAmount' }
          }
        },
        {
          $sort: { _id: 1 }
        },
        {
          $limit: 12
        }
      ])
    ]);

    const metrics = {
      totalOrders: totalOrders[0] || 0,
      totalRevenue: totalRevenue[0] ? totalRevenue[0].total : 0,
      totalProducts: totalProducts,
      topProducts: topProducts,
      orderStatusBreakdown: orderStatusBreakdown[0] || {},
      dailyOrders: dailyOrders,
      monthlyRevenue: monthlyRevenue
    };

    res.status(200).json({
      status: 'success',
      data: metrics
    });
  } catch (error) {
    next(error);
  }
});

// Get supplier performance
exports.getSupplierPerformance = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;

    // Mock performance data
    const performance = {
      fulfillmentRate: 95.2, // % of orders fulfilled on time
      averageProcessingTime: 24, // hours
      returnRate: 2.1, // % of returns
      customerSatisfaction: 4.2, // out of 5
      onTimeDeliveryRate: 87.5, // % delivered on time
      cancellationRate: 1.2, // % of cancellations
      disputeRate: 0.8 // % of disputes
    };

    res.status(200).json({
      status: 'success',
      data: {
        performance
      }
    });
  } catch (error) {
    next(error);
  }
});