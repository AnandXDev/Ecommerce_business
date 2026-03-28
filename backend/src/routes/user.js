const express = require('express');
const router = express.Router();

// Import middleware
const { protect } = require('../middleware/auth');
const {
  validateProfileUpdate,
  validateSettingsUpdate,
  validatePasswordChange,
  validateObjectId,
  validateAvatar
} = require('../middleware/validation');

// Import controllers
const userProfileController = require('../controllers/userProfileController');
const userOrdersController = require('../controllers/userOrdersController');
const wishlistController = require('../controllers/wishlistController');
const savedCartsController = require('../controllers/savedCartsController');

// Apply authentication middleware to all routes
router.use(protect);

// ==============================
// 👤 USER PROFILE ROUTES
// ==============================

// GET /api/user/profile - Get current user profile
router.get('/profile', userProfileController.getProfile);

// PUT /api/user/profile - Update user profile
router.put('/profile', validateProfileUpdate, userProfileController.updateProfile);

// PUT /api/user/settings - Update user settings
router.put('/settings', validateSettingsUpdate, userProfileController.updateSettings);

// PUT /api/user/password - Change password
router.put('/password', validatePasswordChange, userProfileController.changePassword);

// POST /api/user/avatar - Upload/update avatar
router.post('/avatar', validateAvatar, userProfileController.uploadAvatar);

// DELETE /api/user/account - Delete account
router.delete('/account', userProfileController.deleteAccount);

// GET /api/user/stats - Get account statistics
router.get('/stats', userProfileController.getAccountStats);

// ==============================
// 🏠 ADDRESS MANAGEMENT ROUTES
// ==============================

// GET /api/user/addresses - Get user addresses
router.get('/addresses', userProfileController.getAddresses);

// POST /api/user/addresses - Add new address
router.post('/addresses', userProfileController.addAddress);

// PUT /api/user/addresses/:addressId - Update address
router.put('/addresses/:addressId', validateObjectId('addressId'), userProfileController.updateAddress);

// DELETE /api/user/addresses/:addressId - Delete address
router.delete('/addresses/:addressId', validateObjectId('addressId'), userProfileController.deleteAddress);

// ==============================
// 📦 ORDERS MANAGEMENT ROUTES
// ==============================

// GET /api/orders - Get all orders of logged-in user
router.get('/', userOrdersController.getOrders);

// GET /api/orders/stats - Get order statistics for user
router.get('/stats', userOrdersController.getOrderStats);

// GET /api/orders/:id - Get single order by ID
router.get('/:id', validateObjectId('id'), userOrdersController.getOrder);

// PUT /api/orders/:id/cancel - Cancel order
router.put('/:id/cancel', validateObjectId('id'), userOrdersController.cancelOrder);

// GET /api/orders/:id/track - Track order
router.get('/:id/track', validateObjectId('id'), userOrdersController.trackOrder);

// POST /api/orders/:id/reorder - Reorder items from previous order
router.post('/:id/reorder', validateObjectId('id'), userOrdersController.reorderItems);

// ==============================
// ❤️ WISHLIST ROUTES
// ==============================

// GET /api/wishlist - Get all wishlist items
router.get('/wishlist', wishlistController.getWishlist);

// POST /api/wishlist - Add item to wishlist
router.post('/wishlist', wishlistController.addToWishlist);

// DELETE /api/wishlist/:productId - Remove item from wishlist
router.delete('/wishlist/:productId', validateObjectId('productId'), wishlistController.removeFromWishlist);

// DELETE /api/wishlist - Clear entire wishlist
router.delete('/wishlist', wishlistController.clearWishlist);

// POST /api/wishlist/:productId/to-cart - Move item from wishlist to cart
router.post('/wishlist/:productId/to-cart', validateObjectId('productId'), wishlistController.moveToCart);

// GET /api/wishlist/check/:productId - Check if product is in wishlist
router.get('/wishlist/check/:productId', validateObjectId('productId'), wishlistController.checkWishlist);

// GET /api/wishlist/stats - Get wishlist statistics
router.get('/wishlist/stats', wishlistController.getWishlistStats);

// POST /api/wishlist/share - Share wishlist
router.post('/wishlist/share', wishlistController.shareWishlist);

// PUT /api/wishlist/:productId - Update wishlist item
router.put('/wishlist/:productId', validateObjectId('productId'), wishlistController.updateWishlistItem);

// ==============================
// 🛒 SAVED CARTS ROUTES
// ==============================

// GET /api/saved-carts - Get all saved carts for user
router.get('/saved-carts', savedCartsController.getSavedCarts);

// POST /api/saved-carts - Create new saved cart
router.post('/saved-carts', savedCartsController.createSavedCart);

// POST /api/saved-carts/save-current - Save current cart as saved cart
router.post('/saved-carts/save-current', savedCartsController.saveCurrentCart);

// GET /api/saved-carts/:id - Get single saved cart by ID
router.get('/saved-carts/:id', validateObjectId('id'), savedCartsController.getSavedCart);

// PUT /api/saved-carts/:id - Update saved cart
router.put('/saved-carts/:id', validateObjectId('id'), savedCartsController.updateSavedCart);

// DELETE /api/saved-carts/:id - Delete saved cart
router.delete('/saved-carts/:id', validateObjectId('id'), savedCartsController.deleteSavedCart);

// POST /api/saved-carts/:id/restore - Restore saved cart to active cart
router.post('/saved-carts/:id/restore', validateObjectId('id'), savedCartsController.restoreSavedCart);

// POST /api/saved-carts/:id/items - Add item to saved cart
router.post('/saved-carts/:id/items', validateObjectId('id'), savedCartsController.addItemToSavedCart);

// DELETE /api/saved-carts/:id/items/:productId - Remove item from saved cart
router.delete('/saved-carts/:id/items/:productId', 
  validateObjectId('id'), 
  validateObjectId('productId'), 
  savedCartsController.removeItemFromSavedCart
);

// POST /api/saved-carts/:id/share - Share saved cart
router.post('/saved-carts/:id/share', validateObjectId('id'), savedCartsController.shareSavedCart);

// ==============================
// 🔗 PUBLIC SHARED ROUTES
// ==============================

// GET /api/wishlist/shared/:token - Get shared wishlist (public)
router.get('/wishlist/shared/:token', wishlistController.getSharedWishlist);

// GET /api/saved-carts/shared/:token - Get shared saved cart (public)
router.get('/saved-carts/shared/:token', savedCartsController.getSharedSavedCart);

module.exports = router;
