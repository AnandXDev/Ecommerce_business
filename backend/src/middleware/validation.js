const { body, param, query, validationResult } = require('express-validator');

/**
 * Middleware to handle validation results
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.param,
      message: error.msg,
      value: error.value
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorMessages,
      code: 'VALIDATION_ERROR'
    });
  }
  
  next();
};

/**
 * User profile validation rules
 */
const validateProfileUpdate = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces'),
    
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces'),
    
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
    
  body('phone')
    .optional()
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please provide a valid 10-digit Indian mobile number'),
    
  body('address.street')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Street address must be between 5 and 200 characters'),
    
  body('address.city')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('City can only contain letters and spaces'),
    
  body('address.state')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('State must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('State can only contain letters and spaces'),
    
  body('address.zipCode')
    .optional()
    .matches(/^[1-9][0-9]{5}$/)
    .withMessage('Please provide a valid 6-digit Indian PIN code'),
    
  body('address.country')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Country must be between 2 and 50 characters'),
    
  handleValidationErrors
];

/**
 * User settings validation rules
 */
const validateSettingsUpdate = [
  body('language')
    .optional()
    .isIn(['en', 'hi', 'gu', 'ta', 'te', 'mr', 'bn', 'kn', 'ml', 'pa', 'ur'])
    .withMessage('Invalid language preference'),
    
  body('timezone')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Timezone is required'),
    
  body('currency')
    .optional()
    .isIn(['INR', 'USD', 'EUR', 'GBP'])
    .withMessage('Invalid currency preference'),
    
  body('emailNotifications')
    .optional()
    .isBoolean()
    .withMessage('Email notifications must be a boolean'),
    
  body('smsNotifications')
    .optional()
    .isBoolean()
    .withMessage('SMS notifications must be a boolean'),
    
  body('marketingEmails')
    .optional()
    .isBoolean()
    .withMessage('Marketing emails preference must be a boolean'),
    
  handleValidationErrors
];

/**
 * Password change validation rules
 */
const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required')
    .isLength({ min: 6 })
    .withMessage('Current password must be at least 6 characters'),
    
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number'),
    
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match');
      }
      return true;
    }),
    
  handleValidationErrors
];

/**
 * Forgot password validation rules
 */
const validateForgotPassword = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
    
  handleValidationErrors
];

/**
 * Reset password validation rules
 */
const validateResetPassword = [
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match');
      }
      return true;
    }),
    
  handleValidationErrors
];

/**
 * Order filtering validation rules
 */
const validateOrderFilters = [
  query('status')
    .optional()
    .isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid order status'),
    
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
    
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
    
  query('search')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search term must be between 1 and 100 characters'),
    
  handleValidationErrors
];

/**
 * Wishlist validation rules
 */
const validateWishlist = [
  body('productId')
    .isMongoId()
    .withMessage('Invalid product ID'),
    
  handleValidationErrors
];

/**
 * Saved cart validation rules
 */
const validateSavedCart = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Cart name must be between 1 and 100 characters'),
    
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
    
  body('items')
    .optional()
    .isArray()
    .withMessage('Items must be an array'),
    
  body('items.*.product')
    .optional()
    .isMongoId()
    .withMessage('Invalid product ID'),
    
  body('items.*.quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
    
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
    
  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage('Each tag must be between 1 and 30 characters'),
    
  handleValidationErrors
];

/**
 * MongoDB ObjectId validation
 */
const validateObjectId = (paramName = 'id') => [
  param(paramName)
    .isMongoId()
    .withMessage(`Invalid ${paramName}`),
    
  handleValidationErrors
];

/**
 * Email validation for uniqueness check
 */
const validateEmailUnique = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
    
  handleValidationErrors
];

/**
 * Avatar upload validation
 */
const validateAvatar = [
  body('avatar')
    .optional()
    .isURL()
    .withMessage('Avatar must be a valid URL'),
    
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateProfileUpdate,
  validateSettingsUpdate,
  validatePasswordChange,
  validateForgotPassword,
  validateResetPassword,
  validateOrderFilters,
  validateWishlist,
  validateSavedCart,
  validateObjectId,
  validateEmailUnique,
  validateAvatar
};
