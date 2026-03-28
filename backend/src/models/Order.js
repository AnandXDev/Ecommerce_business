const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: [
      'pending',
      'confirmed',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
      'refunded',
      'failed'
    ],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded', 'partially_refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'paypal', 'stripe', 'razorpay', 'cash_on_delivery'],
    required: true
  },
  paymentDetails: {
    transactionId: String,
    paymentIntentId: String,
    gateway: String,
    amount: Number,
    currency: {
      type: String,
      default: 'USD'
    },
    paidAt: Date,
    failureReason: String
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    variant: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1']
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative']
    },
    comparePrice: Number,
    total: {
      type: Number,
      required: true,
      min: [0, 'Total cannot be negative']
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative']
    },
    productSnapshot: {
      name: String,
      sku: String,
      slug: String,
      images: [String],
      supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier'
      }
    }
  }],
  pricing: {
    subtotal: {
      type: Number,
      required: true,
      min: [0, 'Subtotal cannot be negative']
    },
    tax: {
      type: Number,
      default: 0,
      min: [0, 'Tax cannot be negative']
    },
    shipping: {
      type: Number,
      default: 0,
      min: [0, 'Shipping cannot be negative']
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative']
    },
    total: {
      type: Number,
      required: true,
      min: [0, 'Total cannot be negative']
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  shipping: {
    address: {
      firstName: {
        type: String,
        required: true
      },
      lastName: {
        type: String,
        required: true
      },
      company: String,
      street: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      },
      zipCode: {
        type: String,
        required: true
      },
      country: {
        type: String,
        required: true
      },
      phone: String
    },
    method: {
      type: String,
      enum: ['standard', 'express', 'overnight', 'pickup'],
      default: 'standard'
    },
    cost: {
      type: Number,
      default: 0
    },
    estimatedDelivery: Date,
    tracking: {
      number: String,
      carrier: String,
      url: String,
      status: String,
      updates: [{
        timestamp: Date,
        status: String,
        location: String,
        description: String
      }]
    }
  },
  billing: {
    address: {
      firstName: {
        type: String,
        required: true
      },
      lastName: {
        type: String,
        required: true
      },
      company: String,
      street: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      },
      zipCode: {
        type: String,
        required: true
      },
      country: {
        type: String,
        required: true
      },
      phone: String,
      email: {
        type: String,
        required: true
      }
    },
    sameAsShipping: {
      type: Boolean,
      default: true
    }
  },
  coupons: [{
    code: {
      type: String,
      required: true
    },
    discount: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true
    }
  }],
  customer: {
    email: {
      type: String,
      required: true
    },
    phone: String,
    notes: String
  },
  supplierOrders: [{
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier',
      required: true
    },
    items: [{
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      variant: mongoose.Schema.Types.Mixed,
      quantity: Number,
      price: Number
    }],
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
    supplierOrderId: String,
    trackingInfo: {
      number: String,
      carrier: String,
      url: String
    },
    cost: {
      product: Number,
      shipping: Number,
      total: Number
    },
    profit: {
      type: Number,
      required: true
    },
    forwardedAt: Date,
    confirmedAt: Date,
    shippedAt: Date,
    deliveredAt: Date
  }],
  // Delivery and QR verification
  delivery: {
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    qrCode: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DeliveryQR'
    },
    instructions: String,
    preferredTime: String,
    actualDeliveryTime: Date,
    deliveryPhoto: String,
    deliverySignature: String,
    customerRating: {
      type: Number,
      min: 1,
      max: 5
    },
    customerFeedback: String
  },
  timeline: [{
    timestamp: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: String,
    notifyCustomer: {
      type: Boolean,
      default: true
    }
  }],
  notes: [{
    content: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    isInternal: {
      type: Boolean,
      default: false
    }
  }],
  refunds: [{
    amount: {
      type: Number,
      required: true,
      min: [0, 'Refund amount cannot be negative']
    },
    reason: String,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'processed'],
      default: 'pending'
    },
    refundId: String,
    processedAt: Date,
    items: [{
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      quantity: Number,
      reason: String
    }]
  }],
  reviews: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    title: String,
    content: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  metadata: {
    source: {
      type: String,
      enum: ['web', 'mobile', 'admin', 'api'],
      default: 'web'
    },
    userAgent: String,
    ip: String,
    referrer: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total items
orderSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Virtual for total profit
orderSchema.virtual('totalProfit').get(function() {
  return this.supplierOrders.reduce((total, supplierOrder) => total + supplierOrder.profit, 0);
});

// Virtual for is paid
orderSchema.virtual('isPaid').get(function() {
  return this.paymentStatus === 'paid';
});

// Virtual for can be cancelled
orderSchema.virtual('canBeCancelled').get(function() {
  return ['pending', 'confirmed'].includes(this.status);
});

// Virtual for can be refunded
orderSchema.virtual('canBeRefunded').get(function() {
  return this.isPaid && !['cancelled', 'refunded'].includes(this.status);
});

// Indexes
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'shipping.tracking.number': 1 });
orderSchema.index({ 'supplierOrders.supplier': 1 });
orderSchema.index({ 'supplierOrders.status': 1 });

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `ORD${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Pre-save middleware to calculate totals
orderSchema.pre('save', function(next) {
  // Calculate item totals
  this.items.forEach(item => {
    item.total = item.price * item.quantity;
  });

  // Calculate subtotal
  this.pricing.subtotal = this.items.reduce((total, item) => total + item.total, 0);

  // Calculate total
  this.pricing.total = this.pricing.subtotal + this.pricing.tax + this.pricing.shipping - this.pricing.discount;

  next();
});

// Pre-save middleware to handle billing address
orderSchema.pre('save', function(next) {
  if (this.billing.sameAsShipping && this.shipping.address) {
    this.billing.address = { ...this.shipping.address };
  }
  next();
});

// Instance method to add timeline event
orderSchema.methods.addTimelineEvent = function(status, title, description, notifyCustomer = true) {
  this.timeline.push({
    status,
    title,
    description,
    notifyCustomer,
    timestamp: new Date()
  });
  return this.save();
};

// Instance method to update status
orderSchema.methods.updateStatus = function(newStatus, description = '', notifyCustomer = true) {
  const oldStatus = this.status;
  this.status = newStatus;
  
  // Add timeline event
  this.addTimelineEvent(newStatus, `Order ${newStatus}`, description, notifyCustomer);
  
  // Handle status-specific logic
  if (newStatus === 'confirmed' && oldStatus === 'pending') {
    // Forward to suppliers
    this.forwardToSuppliers();
  }
  
  return this.save();
};

// Instance method to forward to suppliers
orderSchema.methods.forwardToSuppliers = async function() {
  // Group items by supplier
  const supplierGroups = {};
  
  for (const item of this.items) {
    const supplierId = item.productSnapshot.supplier.toString();
    if (!supplierGroups[supplierId]) {
      supplierGroups[supplierId] = {
        supplier: item.productSnapshot.supplier,
        items: [],
        cost: { product: 0, shipping: 0, total: 0 }
      };
    }
    
    supplierGroups[supplierId].items.push({
      product: item.product,
      variant: item.variant,
      quantity: item.quantity,
      price: item.price
    });
    
    // Calculate cost (this would typically come from supplier data)
    supplierGroups[supplierId].cost.product += item.price * item.quantity * 0.7; // Assuming 70% goes to supplier
  }
  
  // Create supplier orders
  for (const supplierId in supplierGroups) {
    const group = supplierGroups[supplierId];
    group.cost.shipping = 10; // Fixed shipping cost for example
    group.cost.total = group.cost.product + group.cost.shipping;
    group.profit = group.items.reduce((total, item) => total + (item.price * item.quantity), 0) - group.cost.total;
    
    this.supplierOrders.push({
      supplier: group.supplier,
      items: group.items,
      cost: group.cost,
      profit: group.profit,
      forwardedAt: new Date()
    });
  }
  
  return this.save();
};

// Instance method to add tracking information
orderSchema.methods.addTracking = function(carrier, trackingNumber, url) {
  this.shipping.tracking = {
    number: trackingNumber,
    carrier,
    url,
    status: 'shipped',
    updates: [{
      timestamp: new Date(),
      status: 'shipped',
      description: `Package shipped via ${carrier}`
    }]
  };
  
  return this.updateStatus('shipped', `Order shipped with tracking ${trackingNumber}`);
};

// Instance method to process refund
orderSchema.methods.processRefund = function(amount, reason, items = []) {
  this.refunds.push({
    amount,
    reason,
    items,
    status: 'pending'
  });
  
  // Update payment status
  if (this.paymentStatus === 'paid') {
    this.paymentStatus = 'refunded';
  }
  
  return this.save();
};

// Static method to find orders by user
orderSchema.statics.findByUser = function(userId, options = {}) {
  const query = { user: userId };
  
  if (options.status) {
    query.status = options.status;
  }
  
  return this.find(query)
    .populate('items.product', 'name slug images')
    .sort({ createdAt: -1 })
    .limit(options.limit || 50);
};

// Static method to get order statistics
orderSchema.statics.getStatistics = function(startDate, endDate) {
  const matchStage = {
    createdAt: {
      $gte: startDate,
      $lte: endDate
    }
  };
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$pricing.total' },
        totalProfit: { $sum: '$totalProfit' },
        averageOrderValue: { $avg: '$pricing.total' },
        ordersByStatus: {
          $push: '$status'
        }
      }
    }
  ]);
};

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
