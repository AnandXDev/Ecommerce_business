const mongoose = require('mongoose');

const savedCartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  name: {
    type: String,
    required: [true, 'Cart name is required'],
    trim: true,
    maxlength: [100, 'Cart name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product ID is required']
    },
    variant: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1']
    },
    price: {
      type: Number,
      required: [true, 'Price is required']
    },
    addedAt: {
      type: Date,
      default: Date.now
    },
    productSnapshot: {
      name: {
        type: String,
        required: true
      },
      slug: {
        type: String,
        required: true
      },
      images: [{
        type: String
      }],
      category: {
        type: String,
        required: true
      },
      sku: {
        type: String,
        required: true
      }
    }
  }],
  // Cart totals
  totals: {
    subtotal: {
      type: Number,
      required: true,
      default: 0
    },
    tax: {
      type: Number,
      required: true,
      default: 0
    },
    shipping: {
      type: Number,
      required: true,
      default: 0
    },
    total: {
      type: Number,
      required: true,
      default: 0
    }
  },
  // Cart metadata
  isDefault: {
    type: Boolean,
    default: false
  },
  isShared: {
    type: Boolean,
    default: false
  },
  shareToken: {
    type: String,
    unique: true,
    sparse: true
  },
  shareExpiresAt: {
    type: Date
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  // Cart status
  status: {
    type: String,
    enum: ['active', 'archived', 'converted'],
    default: 'active'
  },
  convertedAt: {
    type: Date
  },
  convertedOrderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtuals
savedCartSchema.virtual('itemCount').get(function() {
  return this.items.length;
});

savedCartSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

savedCartSchema.virtual('isExpired').get(function() {
  return this.shareExpiresAt && this.shareExpiresAt < new Date();
});

// Indexes for better performance
savedCartSchema.index({ user: 1, status: 1 });
savedCartSchema.index({ user: 1, isDefault: 1 });
savedCartSchema.index({ 'items.product': 1 });
savedCartSchema.index({ shareToken: 1 });
savedCartSchema.index({ createdAt: -1 });
savedCartSchema.index({ tags: 1 });

// Pre-save middleware to calculate totals
savedCartSchema.pre('save', function(next) {
  if (this.isModified('items')) {
    this.totals.subtotal = this.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
    
    // Calculate tax (18% GST for India)
    this.totals.tax = this.totals.subtotal * 0.18;
    
    // Calculate shipping (free above ₹500, otherwise ₹40)
    this.totals.shipping = this.totals.subtotal >= 500 ? 0 : 40;
    
    // Calculate total
    this.totals.total = this.totals.subtotal + this.totals.tax + this.totals.shipping;
  }
  
  // Ensure only one default cart per user
  if (this.isDefault) {
    // We'll handle this in the controller to avoid circular dependencies
  }
  
  // Generate share token if cart is shared
  if (this.isShared && !this.shareToken) {
    this.shareToken = require('crypto').randomBytes(32).toString('hex');
    this.shareExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  } else if (!this.isShared) {
    this.shareToken = undefined;
    this.shareExpiresAt = undefined;
  }
  
  next();
});

// Instance methods
savedCartSchema.methods.addItem = function(product, variant, quantity = 1) {
  // Check if item already exists
  const existingItemIndex = this.items.findIndex(item => 
    item.product.toString() === product._id.toString() && 
    JSON.stringify(item.variant) === JSON.stringify(variant)
  );
  
  if (existingItemIndex > -1) {
    // Update quantity if item exists
    this.items[existingItemIndex].quantity += quantity;
  } else {
    // Add new item if it doesn't exist
    this.items.push({
      product: product._id,
      variant,
      quantity,
      price: product.pricing.basePrice,
      productSnapshot: {
        name: product.name,
        slug: product.slug,
        images: product.images.map(img => img.url),
        category: product.category.name,
        sku: product.sku
      }
    });
  }
  
  return this.save();
};

savedCartSchema.methods.removeItem = function(productId, variant) {
  this.items = this.items.filter(item => 
    item.product.toString() !== productId.toString() || 
    JSON.stringify(item.variant) !== JSON.stringify(variant)
  );
  return this.save();
};

savedCartSchema.methods.updateItemQuantity = function(productId, variant, quantity) {
  const itemIndex = this.items.findIndex(item => 
    item.product.toString() === productId.toString() && 
    JSON.stringify(item.variant) === JSON.stringify(variant)
  );
  
  if (itemIndex > -1) {
    if (quantity <= 0) {
      this.items.splice(itemIndex, 1);
    } else {
      this.items[itemIndex].quantity = quantity;
    }
  }
  
  return this.save();
};

savedCartSchema.methods.markAsConverted = function(orderId) {
  this.status = 'converted';
  this.convertedAt = new Date();
  this.convertedOrderId = orderId;
  return this.save();
};

savedCartSchema.methods.archive = function() {
  this.status = 'archived';
  return this.save();
};

savedCartSchema.methods.restore = function() {
  this.status = 'active';
  this.convertedAt = undefined;
  this.convertedOrderId = undefined;
  return this.save();
};

// Static methods
savedCartSchema.statics.findUserCarts = function(userId, options = {}) {
  const query = { 
    user: userId,
    status: options.status || 'active'
  };
  
  return this.find(query)
    .populate('items.product', 'name slug images status')
    .sort({ isDefault: -1, createdAt: -1 })
    .limit(options.limit || 50);
};

savedCartSchema.statics.findDefaultCart = function(userId) {
  return this.findOne({ 
    user: userId, 
    isDefault: true,
    status: 'active'
  }).populate('items.product', 'name slug images status');
};

savedCartSchema.statics.findByShareToken = function(token) {
  return this.findOne({ 
    shareToken: token,
    isShared: true,
    status: 'active'
  })
  .where('shareExpiresAt').gt(new Date())
  .populate('items.product', 'name slug images status');
};

const SavedCart = mongoose.model('SavedCart', savedCartSchema);

module.exports = SavedCart;
