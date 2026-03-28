const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Invoice = require('../models/Invoice');
const DeliveryQR = require('../models/DeliveryQR');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Create order from cart
// @route   POST /api/orders
exports.createOrder = asyncHandler(async (req, res, next) => {
  const { 
    user, // ✅ MUST
    items, 
    shippingAddress, 
    billingAddress, 
    paymentMethod,
    notes 
  } = req.body;

  // Validate items
  if (!items || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No items in order'
    });
  }

  // Check stock availability
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product ${item.product} not found`
      });
    }
    if (product.inventory.quantity < item.quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock for ${product.name}`
      });
    }
  }

  // Generate order number
  const orderCount = await Order.countDocuments();
  const orderNumber = `ORD-${String(orderCount + 1).padStart(6, '0')}`;

  // Calculate totals
  let subtotal = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product);
    const itemTotal = item.quantity * item.price;
    subtotal += itemTotal;

    orderItems.push({
      product: item.product,
      variant: item.variant || {},
      quantity: item.quantity,
      price: item.price,
      comparePrice: item.comparePrice || 0,
      total: itemTotal,
      productSnapshot: {
        name: product.name,
        sku: product.sku,
        slug: product.slug,
        images: product.images.map(img => img.url),
        supplier: product.supplier
      }
    });

    // Update product inventory
    product.inventory.quantity -= item.quantity;
    await product.save();
  }

  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
  const total = subtotal + tax + shipping;

  // Create order
  const order = new Order({
    orderNumber,
    user: req.user.id,
    items: orderItems,
    shippingAddress,
    billingAddress: billingAddress || shippingAddress,
    paymentMethod,
    customer: {
      email: req.user.email,
      phone: req.user.phone,
      notes
    },
    pricing: {
      subtotal,
      tax,
      shipping,
      total
    }
  });

  await order.save();

  // Clear user cart
  await Cart.findOneAndDelete({ user: req.user.id });

  // Create invoice
  const invoice = new Invoice({
    order: order._id,
    user: req.user.id,
    customer: {
      name: `${req.user.firstName} ${req.user.lastName}`,
      email: req.user.email,
      phone: req.user.phone,
      billingAddress,
      shippingAddress
    },
    items: orderItems.map(item => ({
      product: item.product,
      name: item.productSnapshot.name,
      sku: item.productSnapshot.sku,
      quantity: item.quantity,
      unitPrice: item.price,
      totalPrice: item.total,
      tax: item.total * 0.08
    })),
    pricing: {
      subtotal,
      discount: 0,
      tax,
      shipping,
      total
    },
    payment: {
      method: paymentMethod,
      status: 'pending'
    }
  });

  await invoice.save();

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: {
      order,
      invoice
    }
  });
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status, notes } = req.body;
  
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  // Validate status transition
  const validTransitions = {
    'pending': ['confirmed', 'cancelled'],
    'confirmed': ['processing', 'cancelled'],
    'processing': ['shipped', 'cancelled'],
    'shipped': ['delivered', 'cancelled'],
    'delivered': [],
    'cancelled': []
  };

  if (!validTransitions[order.status].includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status transition from ${order.status} to ${status}`
    });
  }

  order.status = status;
  
  // Add timeline entry
  order.timeline.push({
    status,
    title: status.charAt(0).toUpperCase() + status.slice(1),
    description: notes || `Order ${status}`,
    timestamp: new Date()
  });

  // Set timestamps for specific statuses
  if (status === 'confirmed') order.dates.confirmed = new Date();
  if (status === 'shipped') order.dates.shipped = new Date();
  if (status === 'delivered') order.dates.delivered = new Date();

  await order.save();

  res.status(200).json({
    success: true,
    message: `Order status updated to ${status}`,
    data: order
  });
});

// @desc    Assign delivery boy
// @route   PUT /api/orders/:id/assign-delivery
exports.assignDelivery = asyncHandler(async (req, res, next) => {
  const { deliveryBoyId, instructions, preferredTime } = req.body;
  
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  if (order.status !== 'processing') {
    return res.status(400).json({
      success: false,
      message: 'Order must be in processing status to assign delivery'
    });
  }

  // Assign delivery boy
  order.delivery = {
    assignedTo: deliveryBoyId,
    instructions,
    preferredTime
  };

  // Generate QR code for delivery
  const qrCode = new DeliveryQR({
    order: order._id,
    deliveryBoy: deliveryBoyId
  });

  await qrCode.save();
  order.delivery.qrCode = qrCode._id;

  // Update order status to shipped
  order.status = 'shipped';
  order.timeline.push({
    status: 'shipped',
    title: 'Order Shipped',
    description: `Order assigned to delivery boy. QR code generated.`,
    timestamp: new Date()
  });

  await order.save();

  res.status(200).json({
    success: true,
    message: 'Delivery boy assigned successfully',
    data: {
      order,
      qrCode
    }
  });
});

// @desc    Verify delivery with QR code
// @route   POST /api/orders/:id/verify-delivery
exports.verifyDelivery = asyncHandler(async (req, res, next) => {
  const { qrCode, location, photo, signature } = req.body;
  
  const order = await Order.findById(req.params.id)
    .populate('delivery.assignedTo')
    .populate('delivery.qrCode');

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  if (order.status !== 'shipped') {
    return res.status(400).json({
      success: false,
      message: 'Order must be shipped to verify delivery'
    });
  }

  // Verify QR code
  if (order.delivery.qrCode.qrCode !== qrCode) {
    return res.status(400).json({
      success: false,
      message: 'Invalid QR code'
    });
  }

  // Check if QR code is expired
  if (order.delivery.qrCode.expiresAt < new Date()) {
    return res.status(400).json({
      success: false,
      message: 'QR code has expired'
    });
  }

  // Update QR code verification
  order.delivery.qrCode.status = 'verified';
  order.delivery.qrCode.verificationDetails = {
    scannedAt: new Date(),
    verifiedAt: new Date(),
    ipAddress: req.ip,
    userAgent: req.get('User-Agent'),
    scanLocation: location,
    photoUrl: photo,
    deliverySignature: signature
  };

  // Update order
  order.status = 'delivered';
  order.delivery.actualDeliveryTime = new Date();
  order.delivery.deliveryPhoto = photo;
  order.delivery.deliverySignature = signature;

  order.timeline.push({
    status: 'delivered',
    title: 'Order Delivered',
    description: 'Order successfully delivered and verified with QR code',
    timestamp: new Date()
  });

  // Update delivery boy stats
  const deliveryBoy = order.delivery.assignedTo;
  if (deliveryBoy && deliveryBoy.role === 'delivery_boy') {
    deliveryBoy.deliveryBoyProfile.totalDeliveries += 1;
    deliveryBoy.deliveryBoyProfile.successfulDeliveries += 1;
    
    // Calculate earnings (example: $5 per delivery)
    const deliveryFee = 5;
    deliveryBoy.deliveryBoyProfile.earnings.today += deliveryFee;
    deliveryBoy.deliveryBoyProfile.earnings.total += deliveryFee;
    
    await deliveryBoy.save();
  }

  await Promise.all([
    order.save(),
    order.delivery.qrCode.save()
  ]);

  res.status(200).json({
    success: true,
    message: 'Delivery verified successfully',
    data: order
  });
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
exports.cancelOrder = asyncHandler(async (req, res, next) => {
  const { reason } = req.body;
  
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  // Can only cancel pending or confirmed orders
  if (!['pending', 'confirmed'].includes(order.status)) {
    return res.status(400).json({
      success: false,
      message: 'Order cannot be cancelled at this stage'
    });
  }

  // Restore product inventory
  for (const item of order.items) {
    const product = await Product.findById(item.product);
    if (product) {
      product.inventory.quantity += item.quantity;
      await product.save();
    }
  }

  order.status = 'cancelled';
  order.timeline.push({
    status: 'cancelled',
    title: 'Order Cancelled',
    description: reason || 'Order cancelled by customer',
    timestamp: new Date()
  });

  await order.save();

  res.status(200).json({
    success: true,
    message: 'Order cancelled successfully',
    data: order
  });
});

// @desc    Get user orders
// @route   GET /api/orders
exports.getOrders = asyncHandler(async (req, res, next) => {
  console.log('=== GET ORDERS DEBUG ===');
  console.log('User from req.user:', req.user);
  console.log('User ID:', req.user?.id);
  console.log('Auth header:', req.headers.authorization);
  
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('items.product', 'name images');

    const total = await Order.countDocuments({ user: req.user.id });

    console.log('Orders found:', orders.length);
    console.log('Total orders:', total);

    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error in getOrders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
});

// @desc    Get single order
// @route   GET /api/orders/:id
exports.getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'firstName lastName email')
    .populate('items.product', 'name images')
    .populate('shippingAddress');

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  // Make sure user owns the order
  if (order.user._id.toString() !== req.user.id) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this order'
    });
  }

  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Create new order
// @route   POST /api/orders

// exports.createOrder = asyncHandler(async (req, res, next) => {
//   const {
//     items,
//     shippingAddress,
//     paymentMethod,
//     coupon
//   } = req.body;

//   if (!items || items.length === 0) {
//     return res.status(400).json({
//       success: false,
//       message: 'No items in order'
//     });
//   }

//   // Calculate total amount
//   const totalAmount = items.reduce((total, item) => {
//     return total + (item.price * item.quantity);
//   }, 0);

//   const order = new Order({
//     user: req.user.id,
//     items,
//     shippingAddress,
//     paymentMethod,
//     totalAmount,
//     status: 'pending'
//   });

//   const createdOrder = await order.save();

//   res.status(201).json({
//     success: true,
//     message: 'Order created successfully',
//     data: createdOrder
//   });
// });

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// exports.cancelOrder = asyncHandler(async (req, res, next) => {
//   const order = await Order.findById(req.params.id);

//   if (!order) {
//     return res.status(404).json({
//       success: false,
//       message: 'Order not found'
//     });
//   }

//   if (order.user.toString() !== req.user.id) {
//     return res.status(401).json({
//       success: false,
//       message: 'Not authorized to cancel this order'
//     });
//   }

//   if (order.status !== 'pending') {
//     return res.status(400).json({
//       success: false,
//       message: 'Order cannot be cancelled at this stage'
//     });
//   }

//   order.status = 'cancelled';
//   order.cancelledAt = Date.now();
//   await order.save();

//   res.status(200).json({
//     success: true,
//     message: 'Order cancelled successfully',
//     data: order
//   });
// });

// @desc    Track order
// @route   GET /api/orders/:id/track
exports.trackOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .select('status trackingNumber createdAt updatedAt')
    .populate('items.product', 'name');

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  res.status(200).json({
    success: true,
    data: {
      orderId: order._id,
      status: order.status,
      trackingNumber: order.trackingNumber,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      items: order.items.map(item => ({
        name: item.product.name,
        quantity: item.quantity
      }))
    }
  });
});

// @desc    Add review to order
// @route   POST /api/orders/:id/review
exports.addOrderReview = asyncHandler(async (req, res, next) => {
  const { rating, comment } = req.body;

  if (!rating || !comment) {
    return res.status(400).json({
      success: false,
      message: 'Rating and comment are required'
    });
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  if (order.user.toString() !== req.user.id) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to review this order'
    });
  }

  if (order.status !== 'delivered') {
    return res.status(400).json({
      success: false,
      message: 'Order must be delivered before reviewing'
    });
  }

  // Add review to order
  order.reviews.push({
    user: req.user.id,
    rating,
    comment,
    createdAt: Date.now()
  });

  await order.save();

  res.status(200).json({
    success: true,
    message: 'Review added successfully',
    data: order
  });
});

// @desc    Get order statistics
// @route   GET /api/orders/stats
exports.getOrderStats = asyncHandler(async (req, res, next) => {
  const stats = await Order.aggregate([
    { $match: { user: mongoose.Types.ObjectId(req.user.id) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        total: { $sum: '$totalAmount' }
      }
    },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: '$count' },
        totalSpent: { $sum: '$total' },
        averageOrderValue: { $avg: '$total' }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: stats[0] || {
      totalOrders: 0,
      totalSpent: 0,
      averageOrderValue: 0
    }
  });
});
