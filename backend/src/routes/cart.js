const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const cartController = require('../controllers/cartController');

// Apply auth middleware to all cart routes
router.use(protect);

// GET /api/cart - Get user's cart
router.get('/', cartController.getCart);

// POST /api/cart/sync - Sync cart with server
router.post('/sync', cartController.syncCart);

// POST /api/cart - Add item to cart
router.post('/', cartController.addToCart);

// PUT /api/cart/:itemId - Update cart item quantity
router.put('/:itemId', cartController.updateCartItem);

// DELETE /api/cart/:itemId - Remove item from cart
router.delete('/:itemId', cartController.removeFromCart);

// DELETE /api/cart - Clear entire cart
router.delete('/', cartController.clearCart);

// POST /api/cart/apply-coupon - Apply coupon code
router.post('/apply-coupon', cartController.applyCoupon);

// POST /api/cart/remove-coupon - Remove coupon
router.post('/remove-coupon', cartController.removeCoupon);

module.exports = router;
