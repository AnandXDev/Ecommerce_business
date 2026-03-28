const Order = require('../models/Order');
const { sendSuccess, sendError, catchAsync, getPagination, createPaginationMeta } = require('../middleware/errorHandler');

/**
 * @desc    Get all orders of logged-in user
 * @route   GET /api/orders
 * @access  Private
 */
const getOrders = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, status, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

  // Build query
  const query = { user: req.user._id };

  // Filter by status
  if (status && status !== 'all') {
    query.status = status;
  }

  // Search functionality
  if (search) {
    query.$or = [
      { orderNumber: { $regex: search, $options: 'i' } },
      { 'items.productSnapshot.name': { $regex: search, $options: 'i' } }
    ];
  }

  // Sort options
  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  // Pagination
  const { limit: limitNum, skip } = getPagination(page, limit);

  // Execute query
  const [orders, total] = await Promise.all([
    Order.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .populate('items.product', 'name slug images')
      .select('-__v'),
    Order.countDocuments(query)
  ]);

  // Transform orders for frontend
  const transformedOrders = orders.map(order => ({
    id: order._id,
    orderNumber: order.orderNumber,
    status: order.status,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod,
    items: order.items.map(item => ({
      id: item._id,
      product: {
        id: item.product._id,
        name: item.productSnapshot?.name || item.product?.name || 'Product',
        slug: item.product?.slug,
        images: item.productSnapshot?.images || item.product?.images || []
      },
      quantity: item.quantity,
      price: item.price,
      total: item.total
    })),
    pricing: {
      subtotal: order.pricing?.subtotal || 0,
      tax: order.pricing?.tax || 0,
      shipping: order.pricing?.shipping || 0,
      total: order.pricing?.total || 0
    },
    shippingAddress: order.shippingAddress,
    trackingNumber: order.trackingNumber,
    estimatedDelivery: order.estimatedDelivery,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt
  }));

  // Create pagination metadata
  const meta = createPaginationMeta(total, parseInt(page), limitNum);

  return sendSuccess(res, 200, 'Orders retrieved successfully', transformedOrders, meta);
});

/**
 * @desc    Get single order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
const getOrder = catchAsync(async (req, res) => {
  const order = await Order.findOne({ 
    _id: req.params.id, 
    user: req.user._id 
  })
  .populate('items.product', 'name slug images category')
  .populate('user', 'firstName lastName email phone');

  if (!order) {
    return sendError(res, 404, 'Order not found');
  }

  // Transform order for frontend
  const transformedOrder = {
    id: order._id,
    orderNumber: order.orderNumber,
    status: order.status,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod,
    items: order.items.map(item => ({
      id: item._id,
      product: {
        id: item.product._id,
        name: item.productSnapshot?.name || item.product?.name || 'Product',
        slug: item.product?.slug,
        images: item.productSnapshot?.images || item.product?.images || [],
        category: item.product?.category?.name || 'General'
      },
      variant: item.variant,
      quantity: item.quantity,
      price: item.price,
      total: item.total
    })),
    pricing: {
      subtotal: order.pricing?.subtotal || 0,
      tax: order.pricing?.tax || 0,
      shipping: order.pricing?.shipping || 0,
      total: order.pricing?.total || 0
    },
    shippingAddress: order.shippingAddress,
    billingAddress: order.billingAddress,
    trackingNumber: order.trackingNumber,
    estimatedDelivery: order.estimatedDelivery,
    notes: order.notes,
    customer: {
      name: `${order.user.firstName} ${order.user.lastName}`,
      email: order.user.email,
      phone: order.user.phone
    },
    createdAt: order.createdAt,
    updatedAt: order.updatedAt
  };

  return sendSuccess(res, 200, 'Order retrieved successfully', transformedOrder);
});

/**
 * @desc    Cancel order
 * @route   PUT /api/orders/:id/cancel
 * @access  Private
 */
const cancelOrder = catchAsync(async (req, res) => {
  const { reason } = req.body;

  const order = await Order.findOne({ 
    _id: req.params.id, 
    user: req.user._id 
  });

  if (!order) {
    return sendError(res, 404, 'Order not found');
  }

  // Check if order can be cancelled
  if (!['pending', 'confirmed'].includes(order.status)) {
    return sendError(res, 400, 'Order cannot be cancelled at this stage', null, 'ORDER_NOT_CANCELLABLE');
  }

  // Update order status
  order.status = 'cancelled';
  order.cancellationReason = reason || 'Customer requested cancellation';
  order.cancelledAt = new Date();

  // Restore product inventory
  for (const item of order.items) {
    await require('../models/Product').findByIdAndUpdate(
      item.product,
      { $inc: { 'inventory.quantity': item.quantity } }
    );
  }

  await order.save();

  return sendSuccess(res, 200, 'Order cancelled successfully', {
    orderId: order._id,
    orderNumber: order.orderNumber,
    status: order.status,
    cancelledAt: order.cancelledAt
  });
});

/**
 * @desc    Track order
 * @route   GET /api/orders/:id/track
 * @access  Private
 */
const trackOrder = catchAsync(async (req, res) => {
  const order = await Order.findOne({ 
    _id: req.params.id, 
    user: req.user._id 
  }).select('orderNumber status trackingNumber estimatedDelivery shippingAddress createdAt updatedAt');

  if (!order) {
    return sendError(res, 404, 'Order not found');
  }

  // Create tracking timeline based on status
  const timeline = [];
  const now = new Date();

  // Order placed
  timeline.push({
    status: 'Order Placed',
    description: 'Your order has been placed successfully',
    timestamp: order.createdAt,
    completed: true
  });

  // Order confirmed
  if (['confirmed', 'processing', 'shipped', 'delivered'].includes(order.status)) {
    timeline.push({
      status: 'Order Confirmed',
      description: 'Your order has been confirmed and is being processed',
      timestamp: new Date(order.createdAt.getTime() + 30 * 60 * 1000), // 30 mins after
      completed: true
    });
  }

  // Processing
  if (['processing', 'shipped', 'delivered'].includes(order.status)) {
    timeline.push({
      status: 'Processing',
      description: 'Your order is being prepared for shipment',
      timestamp: new Date(order.createdAt.getTime() + 2 * 60 * 60 * 1000), // 2 hours after
      completed: true
    });
  }

  // Shipped
  if (['shipped', 'delivered'].includes(order.status)) {
    timeline.push({
      status: 'Shipped',
      description: `Your order has been shipped${order.trackingNumber ? ` (Tracking: ${order.trackingNumber})` : ''}`,
      timestamp: new Date(order.createdAt.getTime() + 24 * 60 * 60 * 1000), // 1 day after
      completed: true
    });
  }

  // Delivered
  if (order.status === 'delivered') {
    timeline.push({
      status: 'Delivered',
      description: 'Your order has been delivered successfully',
      timestamp: order.updatedAt,
      completed: true
    });
  } else if (order.estimatedDelivery && order.estimatedDelivery < now) {
    timeline.push({
      status: 'Out for Delivery',
      description: 'Your order is out for delivery',
      timestamp: new Date(order.estimatedDelivery.getTime() - 2 * 60 * 60 * 1000), // 2 hours before estimated delivery
      completed: true
    });
  }

  // Current status (if not delivered)
  if (order.status !== 'delivered') {
    const currentStatus = {
      pending: 'Order Pending',
      confirmed: 'Order Confirmed',
      processing: 'Processing',
      shipped: 'Shipped',
      cancelled: 'Cancelled'
    };

    timeline.push({
      status: currentStatus[order.status] || 'Processing',
      description: getStatusDescription(order.status),
      timestamp: now,
      completed: false,
      current: true
    });
  }

  const trackingData = {
    orderNumber: order.orderNumber,
    currentStatus: order.status,
    trackingNumber: order.trackingNumber,
    estimatedDelivery: order.estimatedDelivery,
    shippingAddress: order.shippingAddress,
    timeline,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt
  };

  return sendSuccess(res, 200, 'Order tracking information retrieved successfully', trackingData);
});

/**
 * @desc    Reorder items from previous order
 * @route   POST /api/orders/:id/reorder
 * @access  Private
 */
const reorderItems = catchAsync(async (req, res) => {
  const order = await Order.findOne({ 
    _id: req.params.id, 
    user: req.user._id 
  }).populate('items.product');

  if (!order) {
    return sendError(res, 404, 'Order not found');
  }

  // Check if products are still available
  const unavailableItems = [];
  const availableItems = [];

  for (const item of order.items) {
    const product = item.product;
    
    if (!product || product.status !== 'active') {
      unavailableItems.push({
        name: item.productSnapshot?.name || 'Product',
        reason: 'Product not available'
      });
      continue;
    }

    if (product.inventory.quantity < item.quantity) {
      unavailableItems.push({
        name: item.productSnapshot?.name || 'Product',
        reason: 'Insufficient stock'
      });
      continue;
    }

    availableItems.push({
      product: product._id,
      variant: item.variant,
      quantity: item.quantity,
      price: product.pricing.basePrice
    });
  }

  if (availableItems.length === 0) {
    return sendError(res, 400, 'No items are available for reorder', unavailableItems);
  }

  // Add items to user's cart
  const user = await User.findById(req.user._id);
  
  for (const item of availableItems) {
    await user.addToCart(
      { _id: item.product, pricing: { basePrice: item.price } },
      item.variant,
      item.quantity
    );
  }

  const response = {
    message: 'Items added to cart successfully',
    addedItems: availableItems.length,
    unavailableItems,
    cartCount: user.cart.length
  };

  return sendSuccess(res, 200, 'Items reordered successfully', response);
});

/**
 * @desc    Get order statistics for user
 * @route   GET /api/orders/stats
 * @access  Private
 */
const getOrderStats = catchAsync(async (req, res) => {
  const userId = req.user._id;

  const [
    totalOrders,
    pendingOrders,
    completedOrders,
    cancelledOrders,
    totalSpent,
    recentOrders
  ] = await Promise.all([
    Order.countDocuments({ user: userId }),
    Order.countDocuments({ user: userId, status: { $in: ['pending', 'confirmed', 'processing'] } }),
    Order.countDocuments({ user: userId, status: 'delivered' }),
    Order.countDocuments({ user: userId, status: 'cancelled' }),
    Order.aggregate([
      { $match: { user: userId, status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$pricing.total' } } }
    ]),
    Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('orderNumber status pricing.total createdAt')
  ]);

  const stats = {
    totalOrders,
    pendingOrders,
    completedOrders,
    cancelledOrders,
    totalSpent: totalSpent[0]?.total || 0,
    recentOrders: recentOrders.map(order => ({
      orderNumber: order.orderNumber,
      status: order.status,
      total: order.pricing?.total || 0,
      date: order.createdAt
    }))
  };

  return sendSuccess(res, 200, 'Order statistics retrieved successfully', stats);
});

/**
 * Helper function to get status description
 */
function getStatusDescription(status) {
  const descriptions = {
    pending: 'Your order is pending confirmation',
    confirmed: 'Your order has been confirmed',
    processing: 'Your order is being prepared',
    shipped: 'Your order has been shipped and is on its way',
    delivered: 'Your order has been delivered successfully',
    cancelled: 'Your order has been cancelled'
  };
  
  return descriptions[status] || 'Processing your order';
}

module.exports = {
  getOrders,
  getOrder,
  cancelOrder,
  trackOrder,
  reorderItems,
  getOrderStats
};
