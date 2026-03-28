const User = require('../models/User');
const { sendSuccess, sendError, catchAsync, filterObj } = require('../middleware/errorHandler');

/**
 * @desc    Get current user profile
 * @route   GET /api/user/profile
 * @access  Private
 */
const getProfile = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select('-password -passwordResetToken -passwordResetExpires -emailVerificationToken')
    .populate('orderHistory', 'orderNumber status total createdAt')
    .populate('wishlist', 'name price images');

  if (!user) {
    return sendError(res, 404, 'User not found');
  }

  // Transform user data for frontend
  const profileData = {
    id: user._id,
    fullName: user.fullName,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    avatar: user.avatar,
    address: user.addresses.find(addr => addr.isDefault) || user.addresses[0] || null,
    settings: {
      language: user.preferences?.theme || 'en',
      timezone: 'Asia/Kolkata', // Default for Indian users
      currency: 'INR',
      emailNotifications: user.preferences?.newsletter !== false,
      smsNotifications: true,
      marketingEmails: user.preferences?.marketing || false
    },
    isEmailVerified: user.isEmailVerified,
    isPhoneVerified: user.phoneVerified || false,
    lastLogin: user.lastLogin,
    createdAt: user.createdAt,
    stats: {
      totalOrders: user.orderHistory?.length || 0,
      wishlistItems: user.wishlist?.length || 0,
      savedCarts: 0 // Will be calculated separately
    }
  };

  return sendSuccess(res, 200, 'Profile retrieved successfully', profileData);
});

/**
 * @desc    Update user profile
 * @route   PUT /api/user/profile
 * @access  Private
 */
const updateProfile = catchAsync(async (req, res) => {
  // Filter allowed fields
  const allowedFields = ['firstName', 'lastName', 'email', 'phone', 'avatar'];
  const filteredBody = filterObj(req.body, ...allowedFields);

  // Handle address update separately
  if (req.body.address) {
    const { street, city, state, zipCode, country } = req.body.address;
    
    // Find existing address or create new one
    const existingAddressIndex = req.user.addresses.findIndex(addr => 
      addr.street === street && 
      addr.city === city && 
      addr.state === state &&
      addr.zipCode === zipCode
    );

    if (existingAddressIndex !== -1) {
      // Update existing address
      req.user.addresses[existingAddressIndex] = {
        ...req.user.addresses[existingAddressIndex],
        ...req.body.address,
        isDefault: true
      };
    } else {
      // Add new address as default
      req.user.addresses.push({
        ...req.body.address,
        type: 'home',
        isDefault: true
      });
    }

    // Mark other addresses as non-default
    req.user.addresses.forEach((addr, index) => {
      if (index !== req.user.addresses.length - 1) {
        addr.isDefault = false;
      }
    });
  }

  // Check if email is being updated and if it's already taken
  if (filteredBody.email && filteredBody.email !== req.user.email) {
    const existingUser = await User.findOne({ email: filteredBody.email });
    if (existingUser) {
      return sendError(res, 400, 'Email is already in use', null, 'EMAIL_EXISTS');
    }
    // Mark email as unverified when changed
    filteredBody.isEmailVerified = false;
  }

  // Update user
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { ...filteredBody, addresses: req.user.addresses },
    { new: true, runValidators: true }
  ).select('-password -passwordResetToken -passwordResetExpires -emailVerificationToken');

  return sendSuccess(res, 200, 'Profile updated successfully', {
    id: updatedUser._id,
    fullName: updatedUser.fullName,
    firstName: updatedUser.firstName,
    lastName: updatedUser.lastName,
    email: updatedUser.email,
    phone: updatedUser.phone,
    avatar: updatedUser.avatar,
    address: updatedUser.addresses.find(addr => addr.isDefault) || updatedUser.addresses[0] || null,
    isEmailVerified: updatedUser.isEmailVerified
  });
});

/**
 * @desc    Update user settings
 * @route   PUT /api/user/settings
 * @access  Private
 */
const updateSettings = catchAsync(async (req, res) => {
  const allowedFields = ['language', 'timezone', 'currency', 'emailNotifications', 'smsNotifications', 'marketingEmails'];
  const filteredBody = filterObj(req.body, ...allowedFields);

  // Update preferences in user document
  const updateData = {};
  if (filteredBody.language) {
    updateData['preferences.theme'] = filteredBody.language;
  }
  if (filteredBody.emailNotifications !== undefined) {
    updateData['preferences.newsletter'] = filteredBody.emailNotifications;
  }
  if (filteredBody.marketingEmails !== undefined) {
    updateData['preferences.marketing'] = filteredBody.marketingEmails;
  }

  // Store other settings in a separate settings object or in user document
  // For now, we'll store them in the user document
  if (filteredBody.timezone || filteredBody.currency || filteredBody.smsNotifications !== undefined) {
    updateData.settings = {
      ...req.user.settings,
      ...filteredBody
    };
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    updateData,
    { new: true, runValidators: true }
  ).select('-password -passwordResetToken -passwordResetExpires -emailVerificationToken');

  const settingsData = {
    language: updatedUser.preferences?.theme || 'en',
    timezone: updatedUser.settings?.timezone || 'Asia/Kolkata',
    currency: updatedUser.settings?.currency || 'INR',
    emailNotifications: updatedUser.preferences?.newsletter !== false,
    smsNotifications: updatedUser.settings?.smsNotifications !== false,
    marketingEmails: updatedUser.preferences?.marketing || false
  };

  return sendSuccess(res, 200, 'Settings updated successfully', settingsData);
});

/**
 * @desc    Change password
 * @route   PUT /api/user/password
 * @access  Private
 */
const changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Get user with password
  const user = await User.findById(req.user._id).select('+password');

  // Check current password
  if (!await user.correctPassword(currentPassword, user.password)) {
    return sendError(res, 400, 'Current password is incorrect', null, 'INVALID_CURRENT_PASSWORD');
  }

  // Update password
  user.password = newPassword;
  await user.save();

  return sendSuccess(res, 200, 'Password changed successfully');
});

/**
 * @desc    Upload/update avatar
 * @route   POST /api/user/avatar
 * @access  Private
 */
const uploadAvatar = catchAsync(async (req, res) => {
  if (!req.body.avatar) {
    return sendError(res, 400, 'Avatar URL is required');
  }

  // Basic URL validation
  try {
    new URL(req.body.avatar);
  } catch (error) {
    return sendError(res, 400, 'Invalid avatar URL');
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true }
  ).select('-password -passwordResetToken -passwordResetExpires -emailVerificationToken');

  return sendSuccess(res, 200, 'Avatar updated successfully', {
    avatar: user.avatar
  });
});

/**
 * @desc    Delete account
 * @route   DELETE /api/user/account
 * @access  Private
 */
const deleteAccount = catchAsync(async (req, res) => {
  const { password, confirmation } = req.body;

  // Require password and confirmation
  if (!password || !confirmation) {
    return sendError(res, 400, 'Password and confirmation are required');
  }

  if (confirmation !== 'DELETE') {
    return sendError(res, 400, 'Confirmation text must be "DELETE"');
  }

  // Get user with password
  const user = await User.findById(req.user._id).select('+password');

  // Verify password
  if (!await user.correctPassword(password, user.password)) {
    return sendError(res, 400, 'Password is incorrect');
  }

  // Soft delete user
  await User.findByIdAndUpdate(
    req.user._id,
    {
      isActive: false,
      isDeleted: true,
      deletedAt: new Date(),
      email: `deleted_${user._id}_${Date.now()}@deleted.com`
    }
  );

  return sendSuccess(res, 200, 'Account deleted successfully');
});

/**
 * @desc    Get account statistics
 * @route   GET /api/user/stats
 * @access  Private
 */
const getAccountStats = catchAsync(async (req, res) => {
  const Order = require('../models/Order');
  const Wishlist = require('../models/Wishlist');
  const SavedCart = require('../models/SavedCart');

  // Get counts in parallel
  const [totalOrders, wishlist, savedCarts] = await Promise.all([
    Order.countDocuments({ user: req.user._id }),
    Wishlist.findOne({ user: req.user._id }),
    SavedCart.countDocuments({ user: req.user._id, status: 'active' })
  ]);

  const stats = {
    totalOrders,
    wishlistItems: wishlist?.items?.length || 0,
    savedCarts,
    memberSince: req.user.createdAt,
    lastLogin: req.user.lastLogin,
    isEmailVerified: req.user.isEmailVerified,
    isPhoneVerified: req.user.phoneVerified || false
  };

  return sendSuccess(res, 200, 'Account statistics retrieved successfully', stats);
});

/**
 * @desc    Get user addresses
 * @route   GET /api/user/addresses
 * @access  Private
 */
const getAddresses = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id).select('addresses');

  return sendSuccess(res, 200, 'Addresses retrieved successfully', user.addresses || []);
});

/**
 * @desc    Add new address
 * @route   POST /api/user/addresses
 * @access  Private
 */
const addAddress = catchAsync(async (req, res) => {
  const { type, street, city, state, zipCode, country, isDefault } = req.body;

  const newAddress = {
    type: type || 'home',
    street,
    city,
    state,
    zipCode,
    country: country || 'India',
    isDefault: isDefault || false
  };

  const user = await User.findById(req.user._id);

  // If this is default, unset other default addresses
  if (newAddress.isDefault) {
    user.addresses.forEach(addr => {
      addr.isDefault = false;
    });
  }

  user.addresses.push(newAddress);
  await user.save();

  return sendSuccess(res, 201, 'Address added successfully', newAddress);
});

/**
 * @desc    Update address
 * @route   PUT /api/user/addresses/:addressId
 * @access  Private
 */
const updateAddress = catchAsync(async (req, res) => {
  const { addressId } = req.params;
  const updateData = req.body;

  const user = await User.findById(req.user._id);
  const addressIndex = user.addresses.findIndex(addr => 
    addr._id.toString() === addressId
  );

  if (addressIndex === -1) {
    return sendError(res, 404, 'Address not found');
  }

  // If this is being set as default, unset other defaults
  if (updateData.isDefault) {
    user.addresses.forEach(addr => {
      addr.isDefault = false;
    });
  }

  // Update address
  user.addresses[addressIndex] = { ...user.addresses[addressIndex], ...updateData };
  await user.save();

  return sendSuccess(res, 200, 'Address updated successfully', user.addresses[addressIndex]);
});

/**
 * @desc    Delete address
 * @route   DELETE /api/user/addresses/:addressId
 * @access  Private
 */
const deleteAddress = catchAsync(async (req, res) => {
  const { addressId } = req.params;

  const user = await User.findById(req.user._id);
  const addressIndex = user.addresses.findIndex(addr => 
    addr._id.toString() === addressId
  );

  if (addressIndex === -1) {
    return sendError(res, 404, 'Address not found');
  }

  const deletedAddress = user.addresses[addressIndex];

  // Don't allow deletion if it's the only address
  if (user.addresses.length === 1) {
    return sendError(res, 400, 'Cannot delete the only address');
  }

  // If deleting default address, set another as default
  if (deletedAddress.isDefault) {
    user.addresses.forEach((addr, index) => {
      if (index !== addressIndex) {
        addr.isDefault = true;
      }
    });
  }

  user.addresses.splice(addressIndex, 1);
  await user.save();

  return sendSuccess(res, 200, 'Address deleted successfully');
});

module.exports = {
  getProfile,
  updateProfile,
  updateSettings,
  changePassword,
  uploadAvatar,
  deleteAccount,
  getAccountStats,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress
};
