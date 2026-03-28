const Category = require('../models/Category');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all active categories
// @route   GET /api/categories
exports.getCategories = asyncHandler(async (req, res, next) => {
  try {
    console.log('=== CATEGORIES DEBUG ===');
    console.log('Fetching categories...');
    
    // Try to find categories with isActive field first, then fallback
    let categories;
    try {
      categories = await Category.find({ isActive: true })
        .sort({ name: 1 });
      console.log('Found categories with isActive field:', categories.length);
    } catch (error) {
      console.log('isActive field not found, fetching all categories');
      categories = await Category.find()
        .sort({ name: 1 });
      console.log('Found all categories:', categories.length);
    }

    console.log('Categories found:', categories.length);
    console.log('=======================');

    res.status(200).json({
      success: true,
      data: {
        categories: categories
      }
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
    });
  }
});
