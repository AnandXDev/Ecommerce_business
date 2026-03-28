const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const checkoutController = require('../controllers/checkoutController');

// Apply auth middleware to all checkout routes
router.use(protect);

// GET /api/checkout/addresses - Get user addresses
router.get('/addresses', checkoutController.getAddresses);

// POST /api/checkout/addresses - Add new address
router.post('/addresses', checkoutController.addAddress);

// PUT /api/checkout/addresses/:addressId - Update address
router.put('/addresses/:addressId', checkoutController.updateAddress);

// DELETE /api/checkout/addresses/:addressId - Delete address
router.delete('/addresses/:addressId', checkoutController.deleteAddress);

// GET /api/checkout/summary - Get checkout summary
router.get('/summary', checkoutController.getCheckoutSummary);

// POST /api/checkout/validate - Validate checkout data
router.post('/validate', checkoutController.validateCheckout);

module.exports = router;
