const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Supplier name is required'],
    trim: true,
    maxlength: [100, 'Supplier name cannot exceed 100 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  contact: {
    email: {
      type: String,
      required: [true, 'Contact email is required'],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    },
    phone: {
      type: String,
      trim: true,
      match: [
        /^\+?[\d\s-()]{10,}$/,
        'Please provide a valid phone number'
      ]
    },
    website: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: {
        type: String,
        default: 'United States'
      }
    }
  },
  api: {
    endpoint: String,
    apiKey: {
      type: String,
      select: false
    },
    apiSecret: {
      type: String,
      select: false
    },
    webhookUrl: String,
    supportedMethods: [{
      type: String,
      enum: ['GET', 'POST', 'PUT', 'DELETE']
    }],
    rateLimit: {
      requests: Number,
      window: String
    }
  },
  integration: {
    type: {
      type: String,
      enum: ['api', 'csv', 'xml', 'manual'],
      default: 'manual'
    },
    autoSync: {
      type: Boolean,
      default: false
    },
    syncFrequency: {
      type: Number,
      default: 24 // hours
    },
    lastSyncAt: Date,
    syncStatus: {
      type: String,
      enum: ['pending', 'syncing', 'completed', 'failed'],
      default: 'pending'
    },
    syncError: String
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  pricing: {
    commissionRate: {
      type: Number,
      default: 0,
      min: [0, 'Commission rate cannot be negative'],
      max: [100, 'Commission rate cannot exceed 100']
    },
    shippingRates: [{
      method: {
        type: String,
        enum: ['standard', 'express', 'overnight'],
        required: true
      },
      baseRate: {
        type: Number,
        required: true,
        min: [0, 'Base rate cannot be negative']
      },
      perItemRate: {
        type: Number,
        default: 0,
        min: [0, 'Per item rate cannot be negative']
      },
      freeShippingThreshold: Number
    }],
    returnPolicy: {
      days: Number,
      conditions: String,
      restockingFee: Number
    }
  },
  performance: {
    totalOrders: {
      type: Number,
      default: 0
    },
    successfulOrders: {
      type: Number,
      default: 0
    },
    failedOrders: {
      type: Number,
      default: 0
    },
    averageProcessingTime: Number, // in hours
    averageShippingTime: Number, // in days
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
      },
      count: {
        type: Number,
        default: 0,
        min: 0
      }
    },
    totalRevenue: {
      type: Number,
      default: 0
    },
    totalProfit: {
      type: Number,
      default: 0
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  verification: {
    isVerified: {
      type: Boolean,
      default: false
    },
    verifiedAt: Date,
    verificationDocuments: [{
      type: String,
      url: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  settings: {
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      },
      webhook: {
        type: Boolean,
        default: false
      }
    },
    autoConfirmOrders: {
      type: Boolean,
      default: false
    },
    inventoryManagement: {
      type: Boolean,
      default: true
    }
  },
  metadata: {
    notes: String,
    tags: [String],
    createdAt: {
      type: Date,
      default: Date.now
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for success rate
supplierSchema.virtual('performance.successRate').get(function() {
  if (this.performance.totalOrders === 0) return 0;
  return (this.performance.successfulOrders / this.performance.totalOrders) * 100;
});

// Virtual for product count
supplierSchema.virtual('productCount', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'supplier',
  count: true
});

// Indexes
supplierSchema.index({ slug: 1 });
supplierSchema.index({ status: 1 });
supplierSchema.index({ 'contact.email': 1 });
supplierSchema.index({ 'integration.autoSync': 1 });
supplierSchema.index({ 'performance.rating.average': -1 });

// Pre-save middleware to generate slug
supplierSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.isModified('slug')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
  next();
});

// Instance method to update performance metrics
supplierSchema.methods.updatePerformance = function(orderData) {
  this.performance.totalOrders += 1;
  
  if (orderData.success) {
    this.performance.successfulOrders += 1;
    this.performance.totalRevenue += orderData.revenue;
    this.performance.totalProfit += orderData.profit;
  } else {
    this.performance.failedOrders += 1;
  }
  
  // Update average processing and shipping times
  if (orderData.processingTime) {
    const totalProcessingTime = this.performance.averageProcessingTime * (this.performance.totalOrders - 1) + orderData.processingTime;
    this.performance.averageProcessingTime = totalProcessingTime / this.performance.totalOrders;
  }
  
  if (orderData.shippingTime) {
    const totalShippingTime = this.performance.averageShippingTime * (this.performance.totalOrders - 1) + orderData.shippingTime;
    this.performance.averageShippingTime = totalShippingTime / this.performance.totalOrders;
  }
  
  return this.save();
};

// Instance method to update rating
supplierSchema.methods.updateRating = function(newRating) {
  const totalRating = this.performance.rating.average * this.performance.rating.count + newRating;
  this.performance.rating.count += 1;
  this.performance.rating.average = totalRating / this.performance.rating.count;
  return this.save();
};

// Instance method to calculate shipping cost
supplierSchema.methods.calculateShippingCost = function(method, itemCount) {
  const shippingRate = this.pricing.shippingRates.find(rate => rate.method === method);
  if (!shippingRate) return 0;
  
  let cost = shippingRate.baseRate;
  cost += shippingRate.perItemRate * (itemCount - 1); // First item included in base rate
  
  return cost;
};

// Instance method to check if free shipping applies
supplierSchema.methods.hasFreeShipping = function(subtotal, method) {
  const shippingRate = this.pricing.shippingRates.find(rate => rate.method === method);
  return shippingRate && shippingRate.freeShippingThreshold && subtotal >= shippingRate.freeShippingThreshold;
};

// Static method to get top performing suppliers
supplierSchema.statics.getTopPerforming = function(limit = 10) {
  return this.find({ status: 'active' })
    .sort({ 'performance.rating.average': -1, 'performance.totalOrders': -1 })
    .limit(limit);
};

// Static method to get suppliers with auto sync
supplierSchema.statics.getAutoSyncSuppliers = function() {
  return this.find({ 
    status: 'active',
    'integration.autoSync': true 
  });
};

const Supplier = mongoose.model('Supplier', supplierSchema);

module.exports = Supplier;
