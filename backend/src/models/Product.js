const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [200, "Product name cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    shortDescription: {
      type: String,
      maxlength: [500, "Short description cannot exceed 500 characters"],
    },
    sku: {
      type: String,
      required: [true, "SKU is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
    },
    brand: {
      type: String,
      trim: true,
      maxlength: [100, "Brand name cannot exceed 100 characters"],
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: [true, "Supplier is required"],
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        alt: {
          type: String,
          required: true,
        },
        isMain: {
          type: Boolean,
          default: false,
        },
      },
    ],
    variants: [
      {
        name: {
          type: String,
          required: true,
        },
        sku: {
          type: String,
          required: true,
          unique: true,
        },
        price: {
          type: Number,
          required: [true, "Variant price is required"],
          min: [0, "Price cannot be negative"],
        },
        comparePrice: {
          type: Number,
          min: [0, "Compare price cannot be negative"],
        },
        cost: {
          type: Number,
          required: [true, "Cost price is required"],
          min: [0, "Cost price cannot be negative"],
        },
        weight: {
          type: Number,
          min: [0, "Weight cannot be negative"],
        },
        dimensions: {
          length: Number,
          width: Number,
          height: Number,
        },
        inventory: {
          quantity: {
            type: Number,
            required: true,
            min: [0, "Quantity cannot be negative"],
          },
          trackQuantity: {
            type: Boolean,
            default: true,
          },
          allowBackorder: {
            type: Boolean,
            default: false,
          },
          lowStockThreshold: {
            type: Number,
            default: 10,
          },
        },
        attributes: [
          {
            name: {
              type: String,
              required: true,
            },
            value: {
              type: mongoose.Schema.Types.Mixed,
              required: true,
            },
          },
        ],
        images: [String],
        isActive: {
          type: Boolean,
          default: true,
        },
      },
    ],
    pricing: {
      basePrice: {
        type: Number,
        required: [true, "Base price is required"],
        min: [0, "Price cannot be negative"],
      },
      comparePrice: {
        type: Number,
        min: [0, "Compare price cannot be negative"],
      },
      cost: {
        type: Number,
        required: [true, "Cost price is required"],
        min: [0, "Cost price cannot be negative"],
      },
      taxClass: {
        type: String,
        enum: ["standard", "reduced", "zero"],
        default: "standard",
      },
    },
    inventory: {
      quantity: {
        type: Number,
        required: true,
        min: [0, "Quantity cannot be negative"],
      },
      trackQuantity: {
        type: Boolean,
        default: true,
      },
      allowBackorder: {
        type: Boolean,
        default: false,
      },
      lowStockThreshold: {
        type: Number,
        default: 10,
      },
      reserved: {
        type: Number,
        default: 0,
      },
    },
    shipping: {
      weight: {
        type: Number,
        min: [0, "Weight cannot be negative"],
      },
      dimensions: {
        length: Number,
        width: Number,
        height: Number,
      },
      requiresShipping: {
        type: Boolean,
        default: true,
      },
      shippingClass: {
        type: String,
        enum: ["standard", "express", "overnight", "free"],
        default: "standard",
      },
    },
    seo: {
      title: String,
      description: String,
      keywords: [String],
    },
    tags: [String],
    status: {
      type: String,
      enum: ["draft", "active", "inactive", "archived"],
      default: "draft",
    },
    visibility: {
      type: String,
      enum: ["public", "private", "hidden"],
      default: "public",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    trending: {
      type: Boolean,
      default: false,
    },
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    sales: {
      total: {
        type: Number,
        default: 0,
        min: 0,
      },
      count: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    // Add this inside your productSchema definition in Product.js
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        title: String,
        content: String,
        images: [String],
        helpful: {
          type: Number,
          default: 0,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    relatedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    crossSellProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    upSellProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    dropshipping: {
      supplierSku: String,
      supplierUrl: String,
      autoSync: {
        type: Boolean,
        default: true,
      },
      lastSyncAt: Date,
      syncFrequency: {
        type: Number,
        default: 24, // hours
      },
    },
    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual for available inventory
productSchema.virtual("availableInventory").get(function () {
  return this.inventory.quantity - this.inventory.reserved;
});

// Virtual for is in stock
productSchema.virtual("inStock").get(function () {
  return this.inventory.allowBackorder || this.availableInventory > 0;
});

// Virtual for is low stock
productSchema.virtual("isLowStock").get(function () {
  return this.availableInventory <= this.inventory.lowStockThreshold;
});

// Virtual for discount percentage
productSchema.virtual("discountPercentage").get(function () {
  if (
    !this.pricing.comparePrice ||
    this.pricing.comparePrice <= this.pricing.basePrice
  ) {
    return 0;
  }
  return Math.round(
    ((this.pricing.comparePrice - this.pricing.basePrice) /
      this.pricing.comparePrice) *
      100,
  );
});

// Virtual for main image
productSchema.virtual("mainImage").get(function () {
  const mainImage = this.images.find((img) => img.isMain);
  return mainImage || this.images[0];
});

// Virtual fields
productSchema.virtual("price").get(function () {
  return this.pricing.basePrice;
});

productSchema.virtual("isFeatured").get(function () {
  return this.featured || false;
});

productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

// Indexes
productSchema.index({ name: "text", description: "text", tags: "text" });
productSchema.index({ slug: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ category: 1 });
productSchema.index({ supplier: 1 });
productSchema.index({ status: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ trending: 1 });
productSchema.index({ "rating.average": -1 });
productSchema.index({ sales: { total: -1 } });
productSchema.index({ views: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ publishedAt: -1 });

// Pre-save middleware to generate slug
productSchema.pre("save", function (next) {
  if (this.isModified("name") && !this.isModified("slug")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  // Set publishedAt when status changes to active
  if (
    this.isModified("status") &&
    this.status === "active" &&
    !this.publishedAt
  ) {
    this.publishedAt = new Date();
  }

  next();
});

// Pre-save middleware to ensure one main image
productSchema.pre("save", function (next) {
  const mainImages = this.images.filter((img) => img.isMain);
  if (mainImages.length > 1) {
    // Keep only the first one as main
    this.images.forEach((img, index) => {
      img.isMain = index === 0;
    });
  }

  // If no main image and we have images, set first one as main
  if (mainImages.length === 0 && this.images.length > 0) {
    this.images[0].isMain = true;
  }

  next();
});

// Instance method to check if product is available
productSchema.methods.isAvailable = function () {
  return (
    this.status === "active" && this.visibility === "public" && this.inStock
  );
};

// Instance method to get price (with variant support)
productSchema.methods.getPrice = function (variantId = null) {
  if (variantId) {
    const variant = this.variants.id(variantId);
    return variant ? variant.price : this.pricing.basePrice;
  }
  return this.pricing.basePrice;
};

// Instance method to update inventory
productSchema.methods.updateInventory = function (
  quantity,
  operation = "subtract",
) {
  if (operation === "subtract") {
    this.inventory.quantity = Math.max(0, this.inventory.quantity - quantity);
  } else if (operation === "add") {
    this.inventory.quantity += quantity;
  }

  return this.save();
};

// Instance method to reserve inventory
productSchema.methods.reserveInventory = function (quantity) {
  if (this.availableInventory >= quantity) {
    this.inventory.reserved += quantity;
    return this.save();
  }
  throw new Error("Insufficient inventory");
};

// Instance method to release reserved inventory
productSchema.methods.releaseInventory = function (quantity) {
  this.inventory.reserved = Math.max(0, this.inventory.reserved - quantity);
  return this.save();
};

// Instance method to increment views
productSchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

// Instance method to update rating
productSchema.methods.updateRating = function (newRating) {
  const totalRating = this.rating.average * this.rating.count + newRating;
  this.rating.count += 1;
  this.rating.average = totalRating / this.rating.count;
  return this.save();
};

// Static method to find featured products
productSchema.statics.findFeatured = function (limit = 10) {
  return this.find({
    status: "active",
    visibility: "public",
    featured: true,
  })
    .populate("category", "name slug")
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to find trending products
productSchema.statics.findTrending = function (limit = 10) {
  return this.find({
    status: "active",
    visibility: "public",
    trending: true,
  })
    .populate("category", "name slug")
    .sort({ sales: { total: -1 } })
    .limit(limit);
};

// Static method to search products
productSchema.statics.search = function (query, filters = {}) {
  const searchQuery = {
    status: "active",
    visibility: "public",
    ...filters,
  };

  if (query) {
    searchQuery.$text = { $search: query };
  }

  return this.find(searchQuery)
    .populate("category", "name slug")
    .sort({ score: { $meta: "textScore" } });
};

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
