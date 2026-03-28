const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const paymentController = require('../controllers/paymentController');

// Apply auth middleware to all payment routes
router.use(protect);

// POST /api/payments/create-order - Create Razorpay order
router.post('/create-order', paymentController.createRazorpayOrder);

// POST /api/payments/verify - Verify Razorpay payment
router.post('/verify', paymentController.verifyPayment);

// GET /api/payments/:paymentId - Get payment details
router.get('/:paymentId', paymentController.getPaymentDetails);

// POST /api/payments/refund - Refund payment
router.post('/refund', paymentController.refundPayment);

// GET /api/payments/key - Get Razorpay key (for frontend)
router.get('/key', paymentController.getRazorpayKey);

module.exports = router;
