const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const userController = require('../controllers/userController');

// Public routes (auth routes handled in auth.js)
// router.post('/register', userController.register);
// router.post('/login', userController.login);
// router.post('/forgot-password', userController.forgotPassword);
// router.post('/reset-password', userController.resetPassword);
// router.get('/verify-email/:token', userController.verifyEmail);

// Protected routes
router.use(protect);

// GET /api/users/profile - Get user profile
router.get('/profile', userController.getProfile);

// PUT /api/users/profile - Update user profile
router.put('/profile', userController.updateProfile);

// PUT /api/users/password - Change password
router.put('/password', userController.changePassword);

// POST /api/users/avatar - Upload avatar
// router.post('/avatar', userController.uploadAvatar);

// DELETE /api/users/avatar - Remove avatar
// router.delete('/avatar', userController.removeAvatar);

// GET /api/users/addresses - Get user addresses
router.get('/addresses', userController.getAddresses);

// POST /api/users/addresses - Add new address
router.post('/addresses', userController.addAddress);

// PUT /api/users/addresses/:id - Update address
router.put('/addresses/:id', userController.updateAddress);

// DELETE /api/users/addresses/:id - Delete address
router.delete('/addresses/:id', userController.deleteAddress);

// GET /api/users/wishlist - Get wishlist
router.get('/wishlist', userController.getWishlist);

// POST /api/users/wishlist - Add to wishlist
router.post('/wishlist', userController.addToWishlist);

// DELETE /api/users/wishlist/:productId - Remove from wishlist
router.delete('/wishlist/:productId', userController.removeFromWishlist);

// DELETE /api/users/account - Delete user account
// router.delete('/account', userController.deleteAccount);

module.exports = router;
