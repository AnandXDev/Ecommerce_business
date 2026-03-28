const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    unique: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product ID is required']
    },
    addedAt: {
      type: Date,
      default: Date.now
    },
    price: {
      type: Number,
      required: true
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
      status: {
        type: String,
        required: true
      }
    }
  }],
  // Wishlist settings
  isPublic: {
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
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for item count
wishlistSchema.virtual('itemCount').get(function() {
  return this.items.length;
});

// Virtual for total value
wishlistSchema.virtual('totalValue').get(function() {
  return this.items.reduce((total, item) => total + item.price, 0);
});

// Indexes for better performance
wishlistSchema.index({ user: 1 });
wishlistSchema.index({ 'items.product': 1 });
wishlistSchema.index({ shareToken: 1 });
wishlistSchema.index({ isPublic: 1 });

// Pre-save middleware to generate share token if wishlist is public
wishlistSchema.pre('save', function(next) {
  if (this.isPublic && !this.shareToken) {
    this.shareToken = require('crypto').randomBytes(32).toString('hex');
    // Set share link to expire in 30 days
    this.shareExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  } else if (!this.isPublic) {
    this.shareToken = undefined;
    this.shareExpiresAt = undefined;
  }
  next();
});

// Instance method to add item to wishlist
wishlistSchema.methods.addItem = function(product, price) {
  // Check if item already exists
  const existingItem = this.items.find(item => 
    item.product.toString() === product._id.toString()
  );
  
  if (!existingItem) {
    this.items.push({
      product: product._id,
      price,
      productSnapshot: {
        name: product.name,
        slug: product.slug,
        images: product.images.map(img => img.url),
        category: product.category.name,
        status: product.status
      }
    });
  }
  
  return this.save();
};

// Instance method to remove item from wishlist
wishlistSchema.methods.removeItem = function(productId) {
  this.items = this.items.filter(item => 
    item.product.toString() !== productId.toString()
  );
  return this.save();
};

// Instance method to check if item exists
wishlistSchema.methods.hasItem = function(productId) {
  return this.items.some(item => 
    item.product.toString() === productId.toString()
  );
};

// Instance method to clear wishlist
wishlistSchema.methods.clear = function() {
  this.items = [];
  return this.save();
};

// Static method to find or create wishlist
wishlistSchema.statics.findOrCreate = async function(userId) {
  let wishlist = await this.findOne({ user: userId }).populate('items.product');
  
  if (!wishlist) {
    wishlist = await this.create({ user: userId });
    await wishlist.populate('items.product');
  }
  
  return wishlist;
};

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;
