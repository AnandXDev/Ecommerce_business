const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { promisify } = require('util');
const crypto = require('crypto');

// ==============================
// 🔐 PROTECT ROUTES (AUTH)
// ==============================
const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

     // ✅ COOKIE TOKEN
    if (!token && req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    // No token
    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in. Please log in.'
      });
    }

    // Verify token
    const decoded = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET
    );

    // Find user
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'User no longer exists'
      });
    }

    // Attach user
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid or expired token'
    });
  }
};

// ==============================
// 🔒 ROLE RESTRICTION
// ==============================
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission'
      });
    }
    next();
  };
};

// ==============================
// 🔓 OPTIONAL AUTH
// ==============================
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = await promisify(jwt.verify)(
        token,
        process.env.JWT_SECRET
      );

      const user = await User.findById(decoded.id);

      if (user && user.isActive) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    next(); // don't block request
  }
};

// ==============================
// 📧 VERIFY EMAIL TOKEN
// ==============================
const verifyEmailToken = async (req, res, next) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        status: 'fail',
        message: 'Token required'
      });
    }

    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      isEmailVerified: false
    });

    if (!user) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid or expired token'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// ==============================
// 🔑 RESET PASSWORD TOKEN
// ==============================
const verifyResetToken = async (req, res, next) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        status: 'fail',
        message: 'Token required'
      });
    }

    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    }).select('+passwordResetToken +passwordResetExpires');

    if (!user) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid or expired token'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// ==============================
// 👑 ADMIN CHECK
// ==============================
const admin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      status: 'fail',
      message: 'Admin access required'
    });
  }
  next();
};

module.exports = {
  protect,
  restrictTo,
  optionalAuth,
  verifyEmailToken,
  verifyResetToken,
  admin
};