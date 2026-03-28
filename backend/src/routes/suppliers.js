const express = require('express');
const router = express.Router();

// Import controllers
const supplierController = require('../controllers/supplierController');

// Import validation
const {
  createSupplierValidator,
  updateSupplierValidator
} = require('../validators/supplierValidator');

// Import middleware
const { protect, restrictTo } = require('../middleware/auth');

// All supplier routes require authentication and admin role
router.use(protect);
router.use(restrictTo('admin'));

// Public supplier routes (for product catalog)
router.get('/active', supplierController.getActiveSuppliers);

// Protected admin routes
router.get('/', supplierController.getSuppliers);
router.get('/:id', supplierController.getSupplier);
router.post('/', createSupplierValidator, supplierController.createSupplier);
router.patch('/:id', updateSupplierValidator, supplierController.updateSupplier);
router.delete('/:id', supplierController.deleteSupplier);

// Supplier product management
router.get('/:id/products', supplierController.getSupplierProducts);
router.post('/:id/sync', supplierController.syncSupplierProducts);
router.post('/:id/inventory', supplierController.updateSupplierInventory);

// Order management
router.post('/:id/orders', supplierController.placeSupplierOrder);
router.get('/:id/orders/:supplierOrderId/tracking', supplierController.getOrderTracking);

// Analytics and performance
router.get('/:id/analytics', supplierController.getSupplierAnalytics);
router.get('/:id/performance', supplierController.getSupplierPerformance);

module.exports = router;
