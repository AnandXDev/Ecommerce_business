const SavedCart = require('../models/SavedCart');
const Product = require('../models/Product');
const { sendSuccess, sendError, catchAsync, getPagination, createPaginationMeta } = require('../middleware/errorHandler');

/**
 * @desc    Get all saved carts for user
 * @route   GET /api/saved-carts
 * @access  Private
 */
const getSavedCarts = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, status = 'active', sortBy = 'createdAt', sortOrder = 'desc', search } = req.query;

  // Build query
  const query = { user: req.user._id, status };

  // Search functionality
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];
  }

  // Sort options
  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  // Pagination
  const { limit: limitNum, skip } = getPagination(page, limit);

  // Execute query
  const [savedCarts, total] = await Promise.all([
    SavedCart.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .populate('items.product', 'name slug images status')
      .populate('convertedOrderId', 'orderNumber status'),
    SavedCart.countDocuments(query)
  ]);

  // Transform saved carts for frontend
  const transformedCarts = savedCarts.map(cart => ({
    id: cart._id,
    name: cart.name,
    description: cart.description,
    itemCount: cart.itemCount,
    totalItems: cart.totalItems,
    totals: cart.totals,
    isDefault: cart.isDefault,
    isShared: cart.isShared,
    shareToken: cart.shareToken,
    shareExpiresAt: cart.shareExpiresAt,
    tags: cart.tags,
    status: cart.status,
    convertedAt: cart.convertedAt,
    convertedOrder: cart.convertedOrderId ? {
      id: cart.convertedOrderId._id,
      orderNumber: cart.convertedOrderId.orderNumber,
      status: cart.convertedOrderId.status
    } : null,
    createdAt: cart.createdAt,
    updatedAt: cart.updatedAt,
    items: cart.items.map(item => ({
      id: item._id,
      product: {
        id: item.product._id,
        name: item.product.name || item.productSnapshot.name,
        slug: item.product.slug || item.productSnapshot.slug,
        images: item.product.images || item.productSnapshot.images,
        status: item.product.status || item.productSnapshot.status
      },
      variant: item.variant,
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity,
      addedAt: item.addedAt
    }))
  }));

  // Create pagination metadata
  const meta = createPaginationMeta(total, parseInt(page), limitNum);

  return sendSuccess(res, 200, 'Saved carts retrieved successfully', transformedCarts, meta);
});

/**
 * @desc    Get single saved cart by ID
 * @route   GET /api/saved-carts/:id
 * @access  Private
 */
const getSavedCart = catchAsync(async (req, res) => {
  const savedCart = await SavedCart.findOne({ 
    _id: req.params.id, 
    user: req.user._id 
  })
  .populate('items.product', 'name slug images status category')
  .populate('convertedOrderId', 'orderNumber status');

  if (!savedCart) {
    return sendError(res, 404, 'Saved cart not found');
  }

  // Transform saved cart for frontend
  const transformedCart = {
    id: savedCart._id,
    name: savedCart.name,
    description: savedCart.description,
    itemCount: savedCart.itemCount,
    totalItems: savedCart.totalItems,
    totals: savedCart.totals,
    isDefault: savedCart.isDefault,
    isShared: savedCart.isShared,
    shareToken: savedCart.shareToken,
    shareExpiresAt: savedCart.shareExpiresAt,
    tags: savedCart.tags,
    status: savedCart.status,
    convertedAt: savedCart.convertedAt,
    convertedOrder: savedCart.convertedOrderId ? {
      id: savedCart.convertedOrderId._id,
      orderNumber: savedCart.convertedOrderId.orderNumber,
      status: savedCart.convertedOrderId.status
    } : null,
    createdAt: savedCart.createdAt,
    updatedAt: savedCart.updatedAt,
    items: savedCart.items.map(item => ({
      id: item._id,
      product: {
        id: item.product._id,
        name: item.product.name || item.productSnapshot.name,
        slug: item.product.slug || item.productSnapshot.slug,
        images: item.product.images || item.productSnapshot.images,
        status: item.product.status || item.productSnapshot.status,
        category: item.product.category || { name: item.productSnapshot.category }
      },
      variant: item.variant,
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity,
      addedAt: item.addedAt,
      inStock: item.product ? item.product.inventory?.quantity > 0 : false,
      isAvailable: item.product ? item.product.status === 'active' : false
    }))
  };

  return sendSuccess(res, 200, 'Saved cart retrieved successfully', transformedCart);
});

/**
 * @desc    Create new saved cart
 * @route   POST /api/saved-carts
 * @access  Private
 */
const createSavedCart = catchAsync(async (req, res) => {
  const { name, description, items, tags } = req.body;

  // Validate items if provided
  if (items && items.length > 0) {
    const productIds = items.map(item => item.product);
    const products = await Product.find({ _id: { $in: productIds }, status: 'active' });
    
    if (products.length !== productIds.length) {
      return sendError(res, 400, 'Some products are not available', null, 'PRODUCTS_UNAVAILABLE');
    }
  }

  // Create saved cart
  const savedCart = await SavedCart.create({
    user: req.user._id,
    name,
    description,
    items: items || [],
    tags: tags || []
  });

  // Populate and return
  const populatedCart = await SavedCart.findById(savedCart._id)
    .populate('items.product', 'name slug images status');

  return sendSuccess(res, 201, 'Saved cart created successfully', {
    id: populatedCart._id,
    name: populatedCart.name,
    description: populatedCart.description,
    itemCount: populatedCart.itemCount,
    totals: populatedCart.totals,
    tags: populatedCart.tags,
    createdAt: populatedCart.createdAt
  });
});

/**
 * @desc    Save current cart as saved cart
 * @route   POST /api/saved-carts/save-current
 * @access  Private
 */
const saveCurrentCart = catchAsync(async (req, res) => {
  const { name, description } = req.body;

  // Get user's current cart
  const User = require('../models/User');
  const user = await User.findById(req.user._id).populate('cart.product', 'name slug images pricing status');

  if (!user.cart || user.cart.length === 0) {
    return sendError(res, 400, 'Cart is empty', null, 'EMPTY_CART');
  }

  // Validate all products are active
  const unavailableItems = user.cart.filter(item => 
    !item.product || item.product.status !== 'active'
  );

  if (unavailableItems.length > 0) {
    return sendError(res, 400, 'Some items in cart are no longer available', {
      unavailableItems: unavailableItems.map(item => ({
        name: item.product?.name || 'Product',
        reason: !item.product ? 'Product removed' : 'Product inactive'
      }))
    });
  }

  // Create saved cart from current cart
  const savedCartItems = user.cart.map(item => ({
    product: item.product._id,
    variant: item.variant,
    quantity: item.quantity,
    price: item.product.pricing.basePrice,
    productSnapshot: {
      name: item.product.name,
      slug: item.product.slug,
      images: item.product.images.map(img => img.url),
      category: item.product.category?.name || 'General',
      sku: item.product.sku
    }
  }));

  const savedCart = await SavedCart.create({
    user: req.user._id,
    name,
    description,
    items: savedCartItems
  });

  return sendSuccess(res, 201, 'Cart saved successfully', {
    id: savedCart._id,
    name: savedCart.name,
    itemCount: savedCart.itemCount,
    totals: savedCart.totals,
    createdAt: savedCart.createdAt
  });
});

/**
 * @desc    Update saved cart
 * @route   PUT /api/saved-carts/:id
 * @access  Private
 */
const updateSavedCart = catchAsync(async (req, res) => {
  const { name, description, tags, isDefault } = req.body;

  const savedCart = await SavedCart.findOne({ 
    _id: req.params.id, 
    user: req.user._id 
  });

  if (!savedCart) {
    return sendError(res, 404, 'Saved cart not found');
  }

  // Handle default cart logic
  if (isDefault) {
    await SavedCart.updateMany(
      { user: req.user._id, _id: { $ne: req.params.id } },
      { isDefault: false }
    );
  }

  // Update fields
  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (description !== undefined) updateData.description = description;
  if (tags !== undefined) updateData.tags = tags;
  if (isDefault !== undefined) updateData.isDefault = isDefault;

  const updatedCart = await SavedCart.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  ).populate('items.product', 'name slug images status');

  return sendSuccess(res, 200, 'Saved cart updated successfully', {
    id: updatedCart._id,
    name: updatedCart.name,
    description: updatedCart.description,
    tags: updatedCart.tags,
    isDefault: updatedCart.isDefault,
    itemCount: updatedCart.itemCount,
    updatedAt: updatedCart.updatedAt
  });
});

/**
 * @desc    Delete saved cart
 * @route   DELETE /api/saved-carts/:id
 * @access  Private
 */
const deleteSavedCart = catchAsync(async (req, res) => {
  const savedCart = await SavedCart.findOne({ 
    _id: req.params.id, 
    user: req.user._id 
  });

  if (!savedCart) {
    return sendError(res, 404, 'Saved cart not found');
  }

  await SavedCart.findByIdAndDelete(req.params.id);

  return sendSuccess(res, 200, 'Saved cart deleted successfully');
});

/**
 * @desc    Restore saved cart to active cart
 * @route   POST /api/saved-carts/:id/restore
 * @access  Private
 */
const restoreSavedCart = catchAsync(async (req, res) => {
  const savedCart = await SavedCart.findOne({ 
    _id: req.params.id, 
    user: req.user._id 
  }).populate('items.product', 'name slug images pricing status inventory');

  if (!savedCart) {
    return sendError(res, 404, 'Saved cart not found');
  }

  // Check if all products are still available
  const unavailableItems = [];
  const availableItems = [];

  for (const item of savedCart.items) {
    const product = item.product;
    
    if (!product || product.status !== 'active') {
      unavailableItems.push({
        name: item.productSnapshot?.name || 'Product',
        reason: !product ? 'Product removed' : 'Product inactive'
      });
      continue;
    }

    if (product.inventory.quantity < item.quantity) {
      unavailableItems.push({
        name: item.productSnapshot?.name || 'Product',
        reason: `Only ${product.inventory.quantity} available`
      });
      continue;
    }

    availableItems.push(item);
  }

  if (availableItems.length === 0) {
    return sendError(res, 400, 'No items are available to restore', {
      unavailableItems,
      message: 'All items in this saved cart are no longer available'
    });
  }

  // Clear current cart and add available items
  const User = require('../models/User');
  const user = await User.findById(req.user._id);
  
  user.cart = []; // Clear current cart

  for (const item of availableItems) {
    await user.addToCart(
      item.product,
      item.variant,
      item.quantity
    );
  }

  const response = {
    message: 'Cart restored successfully',
    restoredItems: availableItems.length,
    unavailableItems,
    cartCount: user.cart.length,
    cartTotal: user.cart.reduce((total, item) => total + (item.total || 0), 0)
  };

  return sendSuccess(res, 200, 'Saved cart restored to active cart', response);
});

/**
 * @desc    Add item to saved cart
 * @route   POST /api/saved-carts/:id/items
 * @access  Private
 */
const addItemToSavedCart = catchAsync(async (req, res) => {
  const { productId, variant, quantity = 1 } = req.body;

  const [savedCart, product] = await Promise.all([
    SavedCart.findOne({ _id: req.params.id, user: req.user._id }),
    Product.findById(productId)
  ]);

  if (!savedCart) {
    return sendError(res, 404, 'Saved cart not found');
  }

  if (!product) {
    return sendError(res, 404, 'Product not found');
  }

  if (product.status !== 'active') {
    return sendError(res, 400, 'Product is not available');
  }

  // Add item to saved cart
  await savedCart.addItem(product, variant, quantity);

  return sendSuccess(res, 200, 'Item added to saved cart', {
    itemCount: savedCart.itemCount,
    totals: savedCart.totals
  });
});

/**
 * @desc    Remove item from saved cart
 * @route   DELETE /api/saved-carts/:id/items/:productId
 * @access  Private
 */
const removeItemFromSavedCart = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const { variant } = req.query;

  const savedCart = await SavedCart.findOne({ 
    _id: req.params.id, 
    user: req.user._id 
  });

  if (!savedCart) {
    return sendError(res, 404, 'Saved cart not found');
  }

  await savedCart.removeItem(productId, JSON.parse(variant || '{}'));

  return sendSuccess(res, 200, 'Item removed from saved cart', {
    itemCount: savedCart.itemCount,
    totals: savedCart.totals
  });
});

/**
 * @desc    Share saved cart
 * @route   POST /api/saved-carts/:id/share
 * @access  Private
 */
const shareSavedCart = catchAsync(async (req, res) => {
  const { expiresIn = 7 } = req.body;

  const savedCart = await SavedCart.findOne({ 
    _id: req.params.id, 
    user: req.user._id 
  });

  if (!savedCart) {
    return sendError(res, 404, 'Saved cart not found');
  }

  // Make cart shareable
  savedCart.isShared = true;
  savedCart.shareExpiresAt = new Date(Date.now() + expiresIn * 24 * 60 * 60 * 1000);
  await savedCart.save();

  const shareUrl = `${process.env.FRONTEND_URL}/shared-cart/${savedCart.shareToken}`;

  return sendSuccess(res, 200, 'Saved cart shared successfully', {
    shareToken: savedCart.shareToken,
    shareUrl,
    expiresAt: savedCart.shareExpiresAt
  });
});

/**
 * @desc    Get shared saved cart (public endpoint)
 * @route   GET /api/saved-carts/shared/:token
 * @access  Public
 */
const getSharedSavedCart = catchAsync(async (req, res) => {
  const { token } = req.params;

  const savedCart = await SavedCart.findByShareToken(token);

  if (!savedCart) {
    return sendError(res, 404, 'Shared cart not found or expired');
  }

  const transformedCart = {
    name: savedCart.name,
    description: savedCart.description,
    itemCount: savedCart.itemCount,
    totals: savedCart.totals,
    items: savedCart.items.map(item => ({
      product: {
        name: item.productSnapshot.name,
        slug: item.productSnapshot.slug,
        images: item.productSnapshot.images
      },
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity
    })),
    expiresAt: savedCart.shareExpiresAt
  };

  return sendSuccess(res, 200, 'Shared cart retrieved successfully', transformedCart);
});

module.exports = {
  getSavedCarts,
  getSavedCart,
  createSavedCart,
  saveCurrentCart,
  updateSavedCart,
  deleteSavedCart,
  restoreSavedCart,
  addItemToSavedCart,
  removeItemFromSavedCart,
  shareSavedCart,
  getSharedSavedCart
};
