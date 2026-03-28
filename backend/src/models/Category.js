const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    maxlength: [100, 'Category name cannot exceed 100 characters']
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
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  image: {
    url: String,
    alt: String
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  level: {
    type: Number,
    default: 0
  },
  path: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  metadata: {
    productCount: {
      type: Number,
      default: 0
    },
    subcategoryCount: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for subcategories
categorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent'
});

// Virtual for products
categorySchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category'
});

// Indexes
categorySchema.index({ slug: 1 });
categorySchema.index({ parent: 1 });
categorySchema.index({ isActive: 1 });
categorySchema.index({ sortOrder: 1 });

// Pre-save middleware to generate slug and path
categorySchema.pre('save', async function(next) {
  if (this.isModified('name') && !this.isModified('slug')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
  
  // Update path based on parent
  if (this.isModified('parent')) {
    if (this.parent) {
      const parentCategory = await this.constructor.findById(this.parent);
      this.path = parentCategory ? `${parentCategory.path}/${this.slug}` : this.slug;
      this.level = parentCategory ? parentCategory.level + 1 : 0;
    } else {
      this.path = this.slug;
      this.level = 0;
    }
  }
  
  next();
});

// Static method to get root categories
categorySchema.statics.getRootCategories = function() {
  return this.find({ parent: null, isActive: true })
    .sort({ sortOrder: 1, name: 1 })
    .populate('subcategories');
};

// Static method to get category tree
categorySchema.statics.getCategoryTree = function() {
  return this.find({ isActive: true })
    .sort({ sortOrder: 1, name: 1 })
    .populate({
      path: 'subcategories',
      populate: {
        path: 'subcategories'
      }
    });
};

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
