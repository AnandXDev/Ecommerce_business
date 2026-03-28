const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const { sendSuccess, sendError, catchAsync } = require('../middleware/errorHandler');

/**
 * @desc    Get all wishlist items
 * @route   GET /api/wishlist
 * @access  Private
 */
const getWishlist = catchAsync(async (req, res) => {
  const { page = 1, limit = 20, sortBy = 'addedAt', sortOrder = 'desc' } = req.query;

  // Find or create wishlist for user
  let wishlist = await Wishlist.findOne({ user: req.user._id })
    .populate({
      path: 'items.product',
      select: 'name slug images pricing status category featured',
      populate: {
        path: 'category',
        select: 'name slug'
      }
    });

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id });
  }

  // Sort items
  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
  
  wishlist.items.sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    
    if (sortOrder === 'desc') {
      return bValue - aValue;
    }
    return aValue - bValue;
  });

  // Pagination
  const limitNum = parseInt(limit);
  const pageNum = parseInt(page);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;

  const paginatedItems = wishlist.items.slice(startIndex, endIndex);

  // Transform items for frontend
  const transformedItems = paginatedItems.map(item => ({
    id: item._id,
    product: item.product ? {
      id: item.product._id,
      name: item.product.name,
      slug: item.product.slug,
      images: item.product.images,
      pricing: item.product.pricing,
      status: item.product.status,
      category: item.product.category,
      featured: item.product.featured
    } : {
      id: item.product,
      name: item.productSnapshot?.name || 'Product',
      slug: item.productSnapshot?.slug || 'product',
      images: item.productSnapshot?.images || [],
      status: item.productSnapshot?.status || 'inactive',
      category: { name: item.productSnapshot?.category || 'General' }
    },
    price: item.price,
    addedAt: item.addedAt,
    inStock: item.product ? item.product.inventory?.quantity > 0 : false,
    isAvailable: item.product ? item.product.status === 'active' : false
  }));

  const response = {
    items: transformedItems,
    totalCount: wishlist.items.length,
    currentPage: pageNum,
    totalPages: Math.ceil(wishlist.items.length / limitNum),
    hasNextPage: endIndex < wishlist.items.length,
    hasPrevPage: pageNum > 1
  };

  return sendSuccess(res, 200, 'Wishlist retrieved successfully', response);
});

/**
 * @desc    Add item to wishlist
 * @route   POST /api/wishlist
 * @access  Private
 */
const addToWishlist = catchAsync(async (req, res) => {
  const { productId } = req.body;

  // Validate product
  const product = await Product.findById(productId);
  if (!product) {
    return sendError(res, 404, 'Product not found');
  }

  if (product.status !== 'active') {
    return sendError(res, 400, 'Product is not available', null, 'PRODUCT_UNAVAILABLE');
  }

  // Find or create wishlist
  let wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id });
  }

  // Check if item already exists
  if (wishlist.hasItem(productId)) {
    return sendError(res, 400, 'Product already in wishlist', null, 'ALREADY_IN_WISHLIST');
  }

  // Add item to wishlist
  await wishlist.addItem(product, product.pricing.basePrice);

  // Return updated wishlist
  const updatedWishlist = await Wishlist.findById(wishlist._id)
    .populate('items.product', 'name slug images pricing status');

  const transformedItem = {
    id: updatedWishlist.items[updatedWishlist.items.length - 1]._id,
    product: {
      id: product._id,
      name: product.name,
      slug: product.slug,
      images: product.images,
      pricing: product.pricing,
      status: product.status
    },
    price: product.pricing.basePrice,
    addedAt: new Date()
  };

  return sendSuccess(res, 201, 'Product added to wishlist', transformedItem);
});

/**
 * @desc    Remove item from wishlist
 * @route   DELETE /api/wishlist/:productId
 * @access  Private
 */
const removeFromWishlist = catchAsync(async (req, res) => {
  const { productId } = req.params;

  const wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) {
    return sendError(res, 404, 'Wishlist not found');
  }

  // Check if item exists
  if (!wishlist.hasItem(productId)) {
    return sendError(res, 404, 'Product not found in wishlist');
  }

  // Remove item
  await wishlist.removeItem(productId);

  return sendSuccess(res, 200, 'Product removed from wishlist');
});

/**
 * @desc    Clear entire wishlist
 * @route   DELETE /api/wishlist
 * @access  Private
 */
const clearWishlist = catchAsync(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) {
    return sendError(res, 404, 'Wishlist not found');
  }

  await wishlist.clear();

  return sendSuccess(res, 200, 'Wishlist cleared successfully');
});

/**
 * @desc    Move item from wishlist to cart
 * @route   POST /api/wishlist/:productId/to-cart
 * @access  Private
 */
const moveToCart = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const { quantity = 1, variant = {} } = req.body;

  // Find wishlist and product
  const [wishlist, product] = await Promise.all([
    Wishlist.findOne({ user: req.user._id }),
    Product.findById(productId)
  ]);

  if (!wishlist) {
    return sendError(res, 404, 'Wishlist not found');
  }

  if (!product) {
    return sendError(res, 404, 'Product not found');
  }

  // Check if item exists in wishlist
  if (!wishlist.hasItem(productId)) {
    return sendError(res, 404, 'Product not found in wishlist');
  }

  // Check product availability
  if (product.status !== 'active') {
    return sendError(res, 400, 'Product is not available', null, 'PRODUCT_UNAVAILABLE');
  }

  if (product.inventory.quantity < quantity) {
    return sendError(res, 400, 'Insufficient stock', null, 'INSUFFICIENT_STOCK');
  }

  // Add to user's cart
  const User = require('../models/User');
  const user = await User.findById(req.user._id);
  
  await user.addToCart(product, variant, quantity);

  // Remove from wishlist
  await wishlist.removeItem(productId);

  return sendSuccess(res, 200, 'Product moved to cart successfully', {
    cartCount: user.cart.length,
    wishlistCount: wishlist.items.length
  });
});

/**
 * @desc    Check if product is in wishlist
 * @route   GET /api/wishlist/check/:productId
 * @access  Private
 */
const checkWishlist = catchAsync(async (req, res) => {
  const { productId } = req.params;

  const wishlist = await Wishlist.findOne({ user: req.user._id });
  
  const inWishlist = wishlist ? wishlist.hasItem(productId) : false;

  return sendSuccess(res, 200, 'Wishlist check completed', {
    productId,
    inWishlist
  });
});

/**
 * @desc    Get wishlist statistics
 * @route   GET /api/wishlist/stats
 * @access  Private
 */
const getWishlistStats = catchAsync(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id });

  const stats = {
    totalItems: wishlist ? wishlist.items.length : 0,
    totalValue: wishlist ? wishlist.totalValue : 0,
    recentlyAdded: wishlist ? 
      wishlist.items
        .sort((a, b) => b.addedAt - a.addedAt)
        .slice(0, 5)
        .map(item => ({
          productId: item.product,
          name: item.productSnapshot?.name || 'Product',
          price: item.price,
          addedAt: item.addedAt
        })) : []
  };

  return sendSuccess(res, 200, 'Wishlist statistics retrieved successfully', stats);
});

/**
 * @desc    Share wishlist
 * @route   POST /api/wishlist/share
 * @access  Private
 */
const shareWishlist = catchAsync(async (req, res) => {
  const { expiresIn = 7 } = req.body; // Default 7 days

  const wishlist = await Wishlist.findOne({ user: req.user._id })
    .populate('items.product', 'name slug images pricing');

  if (!wishlist || wishlist.items.length === 0) {
    return sendError(res, 400, 'Cannot share empty wishlist');
  }

  // Make wishlist public and generate share token
  wishlist.isPublic = true;
  wishlist.shareExpiresAt = new Date(Date.now() + expiresIn * 24 * 60 * 60 * 1000);
  await wishlist.save();

  const shareUrl = `${process.env.FRONTEND_URL}/wishlist/${wishlist.shareToken}`;

  return sendSuccess(res, 200, 'Wishlist shared successfully', {
    shareToken: wishlist.shareToken,
    shareUrl,
    expiresAt: wishlist.shareExpiresAt,
    itemCount: wishlist.items.length
  });
});

/**
 * @desc    Get shared wishlist (public endpoint)
 * @route   GET /api/wishlist/shared/:token
 * @access  Public
 */
const getSharedWishlist = catchAsync(async (req, res) => {
  const { token } = req.params;

  const wishlist = await Wishlist.findByShareToken(token);

  if (!wishlist) {
    return sendError(res, 404, 'Shared wishlist not found or expired');
  }

  // Transform items for public view
  const transformedItems = wishlist.items.map(item => ({
    id: item._id,
    product: {
      name: item.productSnapshot?.name || 'Product',
      slug: item.productSnapshot?.slug || 'product',
      images: item.productSnapshot?.images || []
    },
    price: item.price,
    addedAt: item.addedAt
  }));

  const response = {
    items: transformedItems,
    itemCount: wishlist.items.length,
    totalValue: wishlist.totalValue,
    expiresAt: wishlist.shareExpiresAt
  };

  return sendSuccess(res, 200, 'Shared wishlist retrieved successfully', response);
});

/**
 * @desc    Update wishlist item (e.g., change price snapshot)
 * @route   PUT /api/wishlist/:productId
 * @access  Private
 */
const updateWishlistItem = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const { price } = req.body;

  const wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) {
    return sendError(res, 404, 'Wishlist not found');
  }

  const itemIndex = wishlist.items.findIndex(item => 
    item.product.toString() === productId
  );

  if (itemIndex === -1) {
    return sendError(res, 404, 'Product not found in wishlist');
  }

  // Update price
  if (price !== undefined) {
    wishlist.items[itemIndex].price = price;
  }

  await wishlist.save();

  return sendSuccess(res, 200, 'Wishlist item updated successfully', {
    productId,
    price: wishlist.items[itemIndex].price
  });
});

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  moveToCart,
  checkWishlist,
  getWishlistStats,
  shareWishlist,
  getSharedWishlist,
  updateWishlistItem
};
