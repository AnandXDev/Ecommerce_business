const { validationResult } = require('express-validator');
const googleAuthService = require('../services/googleAuthService');
const User = require('../models/User');
const {
  signup,
  login,
  googleAuth,
  verifyEmail,
  forgotPassword,
  resetPassword,
  updatePassword,
  logout,

  createSendToken
} = require('../services/authService');
const { sendWelcomeEmail } = require('../services/emailService');


exports.getMe = (req, res) => {
  res.status(200).json({
    status: "success",
    data: { user: req.user }
  });
};

// Sign up new user
exports.signup = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'fail',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const result = await signup(req.body);

    res.status(201).json({
      status: 'success',
      ...result
    });
  } catch (error) {
    next(error);
  }
};

exports.registerUser = async (req, res) => {
  res.json({ message: "Register working" });
};

// Login user
exports.login = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'fail',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;
    const user = await login(email, password);

    createSendToken(user, 200, res, 'Login successful');
    console.log("LOGIN RESPONSE:", res.data);
    
  } catch (error) {
    next(error);
  }
};

// Google OAuth
exports.googleAuth = async (req, res, next) => {
  try {
    const { token } = req.body; // 👈 FIX (important)

    const user = await googleAuthService(token); // 👈 FIX

    createSendToken(user, 200, res, 'Google authentication successful');
  } catch (error) {
    next(error);
  }
};

// Verify email
exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    const user = await verifyEmail(token);

    // Send welcome email
    await sendWelcomeEmail(user);

    createSendToken(user, 200, res, 'Email verified successfully');
  } catch (error) {
    next(error);
  }
};

// Forgot password
exports.forgotPassword = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'fail',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email } = req.body;
    const result = await forgotPassword(email);

    res.status(200).json({
      status: 'success',
      ...result
    });
  } catch (error) {
    next(error);
  }
};

// Reset password
exports.resetPassword = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'fail',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { token } = req.params;
    const { password } = req.body;
    const user = await resetPassword(token, password);

    createSendToken(user, 200, res, 'Password reset successful');
  } catch (error) {
    next(error);
  }
};

// Update password (for logged in users)
exports.updatePassword = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'fail',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;
    const user = await updatePassword(req.user, currentPassword, newPassword);

    createSendToken(user, 200, res, 'Password updated successfully');
  } catch (error) {
    next(error);
  }
};

// Logout user
exports.logout = (req, res, next) => {
  try {
    logout(res);
  } catch (error) {
    next(error);
  }
};

// Update user profile
exports.updateMe = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'fail',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Filter out unwanted fields
    const filteredBody = {};
    const allowedFields = ['firstName', 'lastName', 'phone', 'preferences'];
    
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        filteredBody[key] = req.body[key];
      }
    });

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });
  } catch (error) {
    next(error);
  }
};

// Delete user account
exports.deleteMe = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { isActive: false });

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

// Resend verification email
exports.resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        status: 'fail',
        message: 'Email is already verified'
      });
    }

    const { sendEmailVerification } = require('../services/authService');
    await sendEmailVerification(user);

    res.status(200).json({
      status: 'success',
      message: 'Verification email sent'
    });
  } catch (error) {
    next(error);
  }
};

// Check if email exists
exports.checkEmail = async (req, res, next) => {
  try {
    const { email } = req.params;
    
    const user = await User.findByEmail(email);
    
    res.status(200).json({
      status: 'success',
      data: {
        exists: !!user,
        isVerified: user ? user.isEmailVerified : false
      }
    });
  } catch (error) {
    next(error);
  }
};

// Refresh token
exports.refreshToken = async (req, res, next) => {
  try {
    // User is already attached to req by auth middleware
    const user = req.user;
    
    createSendToken(user, 200, res, 'Token refreshed successfully');
  } catch (error) {
    next(error);
  }
};

// Remove the old module.exports = { ... } block and just use:
module.exports = exports;
// Alternative approach - use exports object directly
// module.exports = exports;
