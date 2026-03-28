const Cart = require('../models/Cart');
const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get user cart
// @route   GET /api/cart
exports.getCart = asyncHandler(async (req, res, next) => {
  console.log("getCart API hit");
  console.log("User:", req.user);

  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated"
    });
  }

  const cart = await Cart.findOne({ user: req.user.id })
    .populate("items.product", "name pricing images slug");

  // ✅ If no cart
  if (!cart) {
    return res.status(200).json({
      status: "success",
      data: {
        items: [],
        totalItems: 0,
        totalPrice: 0,
        coupon: null
      }
    });
  }

  // ✅ SAFE formatting (NO CRASH)
  const formattedCart = {
    ...cart._doc,
    items: cart.items.map(item => ({
      ...item._doc,
      product: item.product || null, // prevent crash
      price:
        item.product?.pricing?.basePrice || item.price || 0 // fallback
    }))
  };

  res.status(200).json({
  status: "success",
  data: {
    items: formattedCart.items || [],
    subtotal: formattedCart.totalPrice || 0,
    itemCount: formattedCart.totalItems || formattedCart.items.length || 0
  }
});
});

// @desc    Add item to cart
// @route   POST /api/cart
exports.addToCart = asyncHandler(async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and quantity are required'
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if ((product.inventory?.quantity || 0) < quantity){
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock'
      });
    }

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = new Cart({
        user: req.user.id,
        items: [{ product: productId, quantity, price: product.pricing.basePrice || 0 }]
      });
    } else {
      // Safe check for items array
      if (!cart.items || !Array.isArray(cart.items)) {
        cart.items = [];
      }
      
      const existingItemIndex = cart.items.findIndex(
        item => item && item.product && item.product.toString() === productId.toString()
      );

      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity, price: product.pricing.basePrice });
      }
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      data: cart
    });
  } catch (error) {
    console.error('Cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add item to cart'
    });
  }
});

// @desc    Update cart item
// @route   PUT /api/cart/:itemId
exports.updateCartItem = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const { itemId } = req.params; // This is receiving the Product ID from your hook

  const cart = await Cart.findOne({ user: req.user.id });
  
  if (!cart) {
    return res.status(404).json({ success: false, message: 'Cart not found' });
  }

  // Find by Cart Item ID (not Product ID)
  const itemIndex = cart.items.findIndex(
    item => item._id.toString() === itemId 
  );

  if (itemIndex === -1) {
    return res.status(404).json({ success: false, message: 'Item not found' });
  }

  cart.items[itemIndex].quantity = quantity;
  await cart.save();

  // IMPORTANT: Ensure your frontend expects 'status: success' 
  res.status(200).json({
    status: 'success', // Changed from 'success: true' to match your hook's check
    data: cart
  });
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
exports.removeFromCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    return res.status(404).json({
      success: false,
      message: 'Cart not found'
    });
  }

  cart.items = cart.items.filter(
    item => item._id.toString() !== req.params.itemId
  );

  await cart.save();

  res.status(200).json({
    success: true,
    message: 'Item removed from cart',
    data: cart
  });
});

// @desc    Clear cart
// @route   DELETE /api/cart
exports.clearCart = asyncHandler(async (req, res, next) => {
  await Cart.findOneAndDelete({ user: req.user.id });

  res.status(200).json({
    success: true,
    message: 'Cart cleared'
  });
});

// @desc    Apply coupon
// @route   POST /api/cart/apply-coupon
exports.applyCoupon = asyncHandler(async (req, res, next) => {
  const { couponCode } = req.body;

  // TODO: Implement coupon logic
  res.status(200).json({
    success: true,
    message: 'Coupon applied successfully',
    data: { discount: 0 }
  });
});

// @desc    Remove coupon
// @route   POST /api/cart/remove-coupon
exports.removeCoupon = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id });
  if (cart) {
    cart.coupon = null;
    await cart.save();
  }

  res.status(200).json({
    success: true,
    message: 'Coupon removed'
  });
});

// @desc    Sync cart with server
// @route   POST /api/cart/sync
exports.syncCart = asyncHandler(async (req, res, next) => {
  const { items } = req.body;
  const userId = req.user.id;

  try {
    // Validate items and get current product data
    const validatedItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      
      if (!product || product.status !== 'active') {
        continue; // Skip invalid products
      }

      // Check if requested quantity is available
      const availableQuantity = product.inventory.quantity;
      const requestedQuantity = Math.min(item.quantity, availableQuantity);

      if (requestedQuantity <= 0) {
        continue; // Skip out of stock items
      }

      const itemTotal = product.pricing.basePrice * requestedQuantity;
      subtotal += itemTotal;

      validatedItems.push({
        productId: product._id,
        slug: product.slug,
        name: product.name,
        images: product.images,
        price: product.pricing.basePrice,
        comparePrice: product.pricing.comparePrice,
        quantity: requestedQuantity,
        subtotal: itemTotal
      });
    }

    // Calculate totals
    const shipping = subtotal > 50 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    // Update or create cart
    let cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
      cart = new Cart({ user: userId });
    }

    cart.items = validatedItems;
    cart.subtotal = subtotal;
    cart.shipping = shipping;
    cart.tax = tax;
    cart.total = total;
    cart.itemCount = validatedItems.reduce((sum, item) => sum + item.quantity, 0);
    cart.lastUpdated = new Date();

    await cart.save();

    res.status(200).json({
      success: true,
      data: {
        cart: {
          items: cart.items,
          subtotal: cart.subtotal,
          shipping: cart.shipping,
          tax: cart.tax,
          total: cart.total,
          itemCount: cart.itemCount,
          lastUpdated: cart.lastUpdated
        }
      }
    });
  } catch (error) {
    next(error);
  }
});
