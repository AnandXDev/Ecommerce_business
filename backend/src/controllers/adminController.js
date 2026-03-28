const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get admin dashboard
// @route   GET /api/admin/dashboard
exports.getDashboard = asyncHandler(async (req, res, next) => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfYear = new Date(today.getFullYear(), 0, 1);

  // Revenue calculations
  const revenueStats = {
    today: await Order.aggregate([
      {
        $match: {
          status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] },
          paymentStatus: 'paid',
          createdAt: { $gte: startOfDay }
        }
      },
      { $group: { _id: null, total: { $sum: '$pricing.total' } } }
    ]),
    week: await Order.aggregate([
      {
        $match: {
          status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] },
          paymentStatus: 'paid',
          createdAt: { $gte: startOfWeek }
        }
      },
      { $group: { _id: null, total: { $sum: '$pricing.total' } } }
    ]),
    month: await Order.aggregate([
      {
        $match: {
          status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] },
          paymentStatus: 'paid',
          createdAt: { $gte: startOfMonth }
        }
      },
      { $group: { _id: null, total: { $sum: '$pricing.total' } } }
    ]),
    year: await Order.aggregate([
      {
        $match: {
          status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] },
          paymentStatus: 'paid',
          createdAt: { $gte: startOfYear }
        }
      },
      { $group: { _id: null, total: { $sum: '$pricing.total' } } }
    ]),
    total: await Order.aggregate([
      {
        $match: {
          status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] },
          paymentStatus: 'paid'
        }
      },
      { $group: { _id: null, total: { $sum: '$pricing.total' } } }
    ])
  };

  // Order statistics
  const orderStats = {
    total: await Order.countDocuments(),
    pending: await Order.countDocuments({ status: 'pending' }),
    confirmed: await Order.countDocuments({ status: 'confirmed' }),
    processing: await Order.countDocuments({ status: 'processing' }),
    shipped: await Order.countDocuments({ status: 'shipped' }),
    delivered: await Order.countDocuments({ status: 'delivered' }),
    cancelled: await Order.countDocuments({ status: 'cancelled' })
  };

  // User statistics
  const userStats = {
    total: await User.countDocuments({ role: 'user' }),
    active: await User.countDocuments({ role: 'user', isActive: true }),
    newThisMonth: await User.countDocuments({
      role: 'user',
      createdAt: { $gte: startOfMonth }
    })
  };

  // Product statistics
  const productStats = {
    total: await Product.countDocuments(),
    active: await Product.countDocuments({ status: 'active' }),
    outOfStock: await Product.countDocuments({ 'inventory.quantity': { $lte: 0 } }),
    lowStock: await Product.countDocuments({
      'inventory.quantity': { $gt: 0, $lte: 10 }
    })
  };

  res.status(200).json({
    success: true,
    data: {
      message: 'Admin dashboard data',
      stats: {
        revenue: {
          today: revenueStats.today[0]?.total || 0,
          week: revenueStats.week[0]?.total || 0,
          month: revenueStats.month[0]?.total || 0,
          year: revenueStats.year[0]?.total || 0,
          total: revenueStats.total[0]?.total || 0
        },
        orders: orderStats,
        users: userStats,
        products: productStats
      }
    }
  });
});

// @desc    Get all users
// @route   GET /api/admin/users
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: {
      users: [],
      message: 'Users list'
    }
  });
});

// @desc    Get single user
// @route   GET /api/admin/users/:id
exports.getUser = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: {
      message: 'User details',
      user: null
    }
  });
});

// @desc    Update user
// @route   PUT /api/admin/users/:id
exports.updateUser = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'User updated successfully'
  });
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
exports.deleteUser = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'User deleted successfully'
  });
});

// @desc    Ban user
// @route   PUT /api/admin/users/:id/ban
exports.banUser = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'User banned successfully'
  });
});

// @desc    Unban user
// @route   PUT /api/admin/users/:id/unban
exports.unbanUser = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'User unbanned successfully'
  });
});

// @desc    Get all products
// @route   GET /api/admin/products
exports.getProducts = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: {
      products: [],
      message: 'Products list'
    }
  });
});

// @desc    Get single product
// @route   GET /api/admin/products/:id
exports.getProduct = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: {
      message: 'Product details',
      product: null
    }
  });
});

// @desc    Create product
// @route   POST /api/admin/products
exports.createProduct = asyncHandler(async (req, res, next) => {
  res.status(201).json({
    success: true,
    message: 'Product created successfully'
  });
});

// @desc    Update product
// @route   PUT /api/admin/products/:id
exports.updateProduct = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'Product updated successfully'
  });
});

// @desc    Delete product
// @route   DELETE /api/admin/products/:id
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'Product deleted successfully'
  });
});

// @desc    Approve product
// @route   PUT /api/admin/products/:id/approve
exports.approveProduct = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'Product approved successfully'
  });
});

// @desc    Reject product
// @route   PUT /api/admin/products/:id/reject
exports.rejectProduct = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'Product rejected successfully'
  });
});

// @desc    Get all orders
// @route   GET /api/admin/orders
exports.getOrders = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: {
      orders: [],
      message: 'Orders list'
    }
  });
});

// @desc    Get single order
// @route   GET /api/admin/orders/:id
exports.getOrder = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: {
      message: 'Order details',
      order: null
    }
  });
});

// @desc    Update order
// @route   PUT /api/admin/orders/:id
exports.updateOrder = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'Order updated successfully'
  });
});

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'Order status updated successfully'
  });
});

// @desc    Ship order
// @route   PUT /api/admin/orders/:id/ship
exports.shipOrder = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'Order shipped successfully'
  });
});

// @desc    Refund order
// @route   PUT /api/admin/orders/:id/refund
exports.refundOrder = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'Order refunded successfully'
  });
});

// @desc    Get all categories
// @route   GET /api/admin/categories
exports.getCategories = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: {
      categories: [],
      message: 'Categories list'
    }
  });
});

// @desc    Create category
// @route   POST /api/admin/categories
exports.createCategory = asyncHandler(async (req, res, next) => {
  res.status(201).json({
    success: true,
    message: 'Category created successfully'
  });
});

// @desc    Update category
// @route   PUT /api/admin/categories/:id
exports.updateCategory = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'Category updated successfully'
  });
});

// @desc    Delete category
// @route   DELETE /api/admin/categories/:id
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'Category deleted successfully'
  });
});

// @desc    Get all coupons
// @route   GET /api/admin/coupons
exports.getCoupons = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: {
      coupons: [],
      message: 'Coupons list'
    }
  });
});

// @desc    Create coupon
// @route   POST /api/admin/coupons
exports.createCoupon = asyncHandler(async (req, res, next) => {
  res.status(201).json({
    success: true,
    message: 'Coupon created successfully'
  });
});

// @desc    Update coupon
// @route   PUT /api/admin/coupons/:id
exports.updateCoupon = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'Coupon updated successfully'
  });
});

// @desc    Delete coupon
// @route   DELETE /api/admin/coupons/:id
exports.deleteCoupon = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'Coupon deleted successfully'
  });
});

// @desc    Get settings
// @route   GET /api/admin/settings
exports.getSettings = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: {
      settings: {},
      message: 'Settings retrieved successfully'
    }
  });
});

// @desc    Update settings
// @route   PUT /api/admin/settings
exports.updateSettings = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'Settings updated successfully'
  });
});

// @desc    Get logs
// @route   GET /api/admin/logs
exports.getLogs = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: {
      logs: [],
      message: 'Logs retrieved successfully'
    }
  });
});

// @desc    Get logs by type
// @route   GET /api/admin/logs/:type
exports.getLogsByType = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: {
      logs: [],
      type: req.params.type,
      message: 'Logs retrieved successfully'
    }
  });
});
