const { body } = require('express-validator');

// Create supplier validation
const createSupplierValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Supplier name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Supplier name must be between 2 and 100 characters'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('phone')
    .trim()
    .optional()
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number'),
  
  body('integrationType')
    .trim()
    .notEmpty()
    .withMessage('Integration type is required')
    .isIn(['aliexpress', 'shopify', 'custom'])
    .withMessage('Integration type must be aliexpress, shopify, or custom'),
  
  body('description')
    .trim()
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  
  body('website')
    .trim()
    .optional()
    .isURL()
    .withMessage('Please provide a valid website URL'),
  
  body('address')
    .optional()
    .isObject()
    .withMessage('Address must be an object'),
  
  body('address.street')
    .if(body('address').exists())
    .trim()
    .notEmpty()
    .withMessage('Street address is required'),
  
  body('address.city')
    .if(body('address').exists())
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  
  body('address.state')
    .if(body('address').exists())
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  
  body('address.zipCode')
    .if(body('address').exists())
    .trim()
    .notEmpty()
    .withMessage('ZIP code is required'),
  
  body('address.country')
    .if(body('address').exists())
    .trim()
    .notEmpty()
    .withMessage('Country is required'),
  
  body('categories')
    .optional()
    .isArray()
    .withMessage('Categories must be an array'),
  
  body('categories.*')
    .if(body('categories').exists())
    .isMongoId()
    .withMessage('Each category must be a valid MongoDB ID'),
  
  body('settings')
    .optional()
    .isObject()
    .withMessage('Settings must be an object'),
  
  body('settings.autoSync')
    .optional()
    .isBoolean()
    .withMessage('Auto sync must be a boolean'),
  
  body('settings.syncInterval')
    .optional()
    .isInt({ min: 1, max: 8760 })
    .withMessage('Sync interval must be between 1 and 8760 hours'),
  
  body('settings.markupPercentage')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Markup percentage must be between 0 and 100'),
  
  body('credentials')
    .optional()
    .isObject()
    .withMessage('Credentials must be an object'),
  
  // Integration-specific validation
  body('shopDomain')
    .if(body('integrationType').equals('shopify'))
    .trim()
    .notEmpty()
    .withMessage('Shop domain is required for Shopify integration'),
  
  body('credentials.apiKey')
    .if(body('integrationType').equals('custom'))
    .trim()
    .notEmpty()
    .withMessage('API key is required for custom integration'),
  
  body('credentials.accessToken')
    .if(body('integrationType').equals('shopify'))
    .trim()
    .notEmpty()
    .withMessage('Access token is required for Shopify integration')
];

// Update supplier validation
const updateSupplierValidator = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Supplier name cannot be empty')
    .isLength({ min: 2, max: 100 })
    .withMessage('Supplier name must be between 2 and 100 characters'),
  
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('phone')
    .optional()
    .trim()
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number'),
  
  body('integrationType')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Integration type cannot be empty')
    .isIn(['aliexpress', 'shopify', 'custom'])
    .withMessage('Integration type must be aliexpress, shopify, or custom'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  
  body('website')
    .optional()
    .trim()
    .isURL()
    .withMessage('Please provide a valid website URL'),
  
  body('address')
    .optional()
    .isObject()
    .withMessage('Address must be an object'),
  
  body('address.street')
    .if(body('address').exists())
    .trim()
    .notEmpty()
    .withMessage('Street address is required'),
  
  body('address.city')
    .if(body('address').exists())
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  
  body('address.state')
    .if(body('address').exists())
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  
  body('address.zipCode')
    .if(body('address').exists())
    .trim()
    .notEmpty()
    .withMessage('ZIP code is required'),
  
  body('address.country')
    .if(body('address').exists())
    .trim()
    .notEmpty()
    .withMessage('Country is required'),
  
  body('categories')
    .optional()
    .isArray()
    .withMessage('Categories must be an array'),
  
  body('categories.*')
    .if(body('categories').exists())
    .isMongoId()
    .withMessage('Each category must be a valid MongoDB ID'),
  
  body('settings')
    .optional()
    .isObject()
    .withMessage('Settings must be an object'),
  
  body('settings.autoSync')
    .optional()
    .isBoolean()
    .withMessage('Auto sync must be a boolean'),
  
  body('settings.syncInterval')
    .optional()
    .isInt({ min: 1, max: 8760 })
    .withMessage('Sync interval must be between 1 and 8760 hours'),
  
  body('settings.markupPercentage')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Markup percentage must be between 0 and 100'),
  
  body('credentials')
    .optional()
    .isObject()
    .withMessage('Credentials must be an object'),
  
  // Integration-specific validation
  body('shopDomain')
    .if(body('integrationType').equals('shopify'))
    .trim()
    .notEmpty()
    .withMessage('Shop domain is required for Shopify integration'),
  
  body('credentials.apiKey')
    .if(body('integrationType').equals('custom'))
    .trim()
    .notEmpty()
    .withMessage('API key is required for custom integration'),
  
  body('credentials.accessToken')
    .if(body('integrationType').equals('shopify'))
    .trim()
    .notEmpty()
    .withMessage('Access token is required for Shopify integration')
];

// Order placement validation
const placeOrderValidator = [
  body('orderData.supplierProductId')
    .notEmpty()
    .withMessage('Supplier product ID is required'),
  
  body('orderData.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer'),
  
  body('orderData.shippingAddress')
    .isObject()
    .withMessage('Shipping address is required'),
  
  body('orderData.shippingAddress.firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required'),
  
  body('orderData.shippingAddress.lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required'),
  
  body('orderData.shippingAddress.street')
    .trim()
    .notEmpty()
    .withMessage('Street address is required'),
  
  body('orderData.shippingAddress.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  
  body('orderData.shippingAddress.state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  
  body('orderData.shippingAddress.zipCode')
    .trim()
    .notEmpty()
    .withMessage('ZIP code is required'),
  
  body('orderData.shippingAddress.country')
    .trim()
    .notEmpty()
    .withMessage('Country is required'),
  
  body('orderData.customerInfo')
    .optional()
    .isObject()
    .withMessage('Customer info must be an object'),
  
  body('orderData.customerInfo.email')
    .if(body('orderData.customerInfo').exists())
    .trim()
    .isEmail()
    .withMessage('Customer email must be valid'),
  
  body('orderData.customerInfo.phone')
    .if(body('orderData.customerInfo').exists())
    .trim()
    .isMobilePhone('any')
    .withMessage('Customer phone must be valid')
];

module.exports = {
  createSupplierValidator,
  updateSupplierValidator,
  placeOrderValidator
};
