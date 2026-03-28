const express = require('express');
const router = express.Router();

// Import controllers
const analyticsController = require('../controllers/analyticsController');

// Import middleware
// const { protect, restrictTo } = require('../middleware/auth');

// TEMPORARILY DISABLED FOR DEVELOPMENT
// All analytics routes require authentication and admin role
// router.use(protect);
// router.use(restrictTo('admin'));

// Dashboard and overview
router.get('/dashboard', analyticsController.getDashboardOverview);
router.get('/realtime', analyticsController.getRealTimeMetrics);
router.get('/health', analyticsController.getSystemHealth);

// Detailed analytics
router.get('/sales', analyticsController.getSalesAnalytics);
router.get('/customers', analyticsController.getCustomerAnalytics);
router.get('/products', analyticsController.getProductAnalytics);
router.get('/orders', analyticsController.getOrderAnalytics);
router.get('/financial', analyticsController.getFinancialAnalytics);

// Data export
router.get('/export', analyticsController.exportAnalytics);

// Custom reports
router.post('/custom', analyticsController.getCustomReport);

module.exports = router;
