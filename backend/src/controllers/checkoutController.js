const User = require('../models/User');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get user addresses
// @route   GET /api/checkout/addresses
exports.getAddresses = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('addresses');
  
  res.status(200).json({
    success: true,
    data: {
      addresses: user.addresses || []
    }
  });
});

// @desc    Add new address
// @route   POST /api/checkout/addresses
exports.addAddress = asyncHandler(async (req, res, next) => {
  const {
    type,
    street,
    city,
    state,
    postalCode,
    country,
    isDefault
  } = req.body;

  // Validate required fields
  if (!street || !city || !state || !postalCode) {
    return res.status(400).json({
      success: false,
      message: 'Street, city, state, and postal code are required'
    });
  }

  const user = await User.findById(req.user.id);
  
  // If this is default, unset other default addresses
  if (isDefault) {
    user.addresses.forEach(addr => addr.isDefault = false);
  }

  // Add new address
  const newAddress = {
    type: type || 'home',
    street,
    city,
    state,
    postalCode,
    country: country || 'United States',
    isDefault: isDefault || false
  };

  user.addresses.push(newAddress);
  await user.save();

  res.status(201).json({
    success: true,
    message: 'Address added successfully',
    data: newAddress
  });
});

// @desc    Update address
// @route   PUT /api/checkout/addresses/:addressId
exports.updateAddress = asyncHandler(async (req, res, next) => {
  const {
    type,
    street,
    city,
    state,
    postalCode,
    country,
    isDefault
  } = req.body;

  const user = await User.findById(req.user.id);
  const address = user.addresses.id(req.params.addressId);

  if (!address) {
    return res.status(404).json({
      success: false,
      message: 'Address not found'
    });
  }

  // If this is default, unset other default addresses
  if (isDefault) {
    user.addresses.forEach(addr => addr.isDefault = false);
  }

  // Update address
  if (type) address.type = type;
  if (street) address.street = street;
  if (city) address.city = city;
  if (state) address.state = state;
  if (postalCode) address.postalCode = postalCode;
  if (country) address.country = country;
  if (isDefault !== undefined) address.isDefault = isDefault;

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Address updated successfully',
    data: address
  });
});

// @desc    Delete address
// @route   DELETE /api/checkout/addresses/:addressId
exports.deleteAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  
  const addressIndex = user.addresses.findIndex(
    addr => addr._id.toString() === req.params.addressId
  );

  if (addressIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Address not found'
    });
  }

  // Check if it's the only address
  if (user.addresses.length === 1) {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete the only address'
    });
  }

  // If deleting default address, set another as default
  if (user.addresses[addressIndex].isDefault && user.addresses.length > 1) {
    user.addresses.forEach((addr, index) => {
      if (index !== addressIndex) {
        addr.isDefault = true;
        return false; // break the loop
      }
    });
  }

  user.addresses.splice(addressIndex, 1);
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Address deleted successfully'
  });
});

// @desc    Get checkout summary
// @route   GET /api/checkout/summary
exports.getCheckoutSummary = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id })
    .populate('items.product', 'name images pricing inventory');

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Your cart is empty'
    });
  }

  // Get user addresses
  const user = await User.findById(req.user.id).select('addresses');
  const defaultAddress = user.addresses?.find(addr => addr.isDefault);

  // Calculate totals
  const subtotal = cart.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
  const total = subtotal + tax + shipping;

  res.status(200).json({
    success: true,
    data: {
      cart: {
        items: cart.items,
        itemCount: cart.items.reduce((count, item) => count + item.quantity, 0)
      },
      addresses: user.addresses || [],
      defaultAddress,
      pricing: {
        subtotal,
        tax,
        shipping,
        total
      }
    }
  });
});

// @desc    Validate checkout
// @route   POST /api/checkout/validate
exports.validateCheckout = asyncHandler(async (req, res, next) => {
  const { shippingAddress, billingAddress, paymentMethod } = req.body;

  // Validate addresses
  if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || 
      !shippingAddress.state || !shippingAddress.postalCode) {
    return res.status(400).json({
      success: false,
      message: 'Complete shipping address is required'
    });
  }

  // Validate payment method
  const validPaymentMethods = ['credit_card', 'debit_card', 'paypal', 'stripe', 'razorpay', 'cash_on_delivery'];
  if (!paymentMethod || !validPaymentMethods.includes(paymentMethod)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid payment method'
    });
  }

  // Check cart and stock
  const cart = await Cart.findOne({ user: req.user.id })
    .populate('items.product', 'name inventory');

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Your cart is empty'
    });
  }

  // Check stock availability
  for (const item of cart.items) {
    if (item.product.inventory.quantity < item.quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock for ${item.product.name}. Only ${item.product.inventory.quantity} available.`
      });
    }
  }

  res.status(200).json({
    success: true,
    message: 'Checkout validated successfully'
  });
});
