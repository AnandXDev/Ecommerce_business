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

  createSendToken,
  createRandomToken,
} = require('../services/authService');
const { sendWelcomeEmail } = require('../services/emailService');
const otpGenerator = require('otp-generator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');


exports.getMe = (req, res) => {
  res.status(200).json({
    status: "success",
    data: { user: req.user }
  });
};

// Sign up new user
exports.signup = async (req, res, next) => {
  try {
   const { email } = req.body;

    // 🔍 1. FETCH USER FROM DB
    const existingUser = await User.findOne({ email });


    // ❌ 2. IF USER EXISTS
    if (existingUser) {
      return res.status(400).json({
        status: "fail",
        message: "User already exists"
      });
    }
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'fail',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // ✅ 1. Create user
    const user = await signup(req.body); // your service

    // ✅ 2. Generate token
    const { rawToken, hashedToken } = createRandomToken();

    // ✅ 3. Save hashed token in DB
    user.verificationToken = hashedToken;
    user.verificationTokenExpires = Date.now() + 10 * 60 * 1000;

    await user.save();

    // ✅ 4. Send email with RAW token
    const verifyURL = `http://localhost:3000/verify-email?token=${rawToken}`;

    await sendEmail(
      user.email,
      'Verify your email',
      `Click to verify: ${verifyURL}`
    );

    // ✅ 5. Send response (NO redirect here)
    res.status(201).json({
      status: 'success',
      message: 'Verification email sent'
    });

  } catch (error) {
    next(error);
  }
};

// exports.registerUser = async (req, res) => {
//   res.json({ message: "Register working" });
// };

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
    const { token } = req.query; // ✅ FIX

    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid or expired token'
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;

    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Email verified successfully'
    });

  } catch (error) {
    next(error);
  }
};

// ✅ SEND OTP
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found. Please signup first"
      });
    }

    // ✅ Generate OTP
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false
    });

    // ✅ Hash OTP
    const hashedOtp = await bcrypt.hash(otp, 10);

    // ✅ Save in DB
    user.otp = hashedOtp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();

    // ✅ FIX EMAIL FORMAT
    await sendEmail({
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}`
    });

    console.log("OTP:", otp); // 🔥 debug

    res.json({
      success: true,
      message: "OTP sent to email"
    });

  } catch (error) {
    console.error("SEND OTP ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ VERIFY OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // ✅ Check OTP exists
    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({
        message: "No OTP found. Request new one."
      });
    }

    // ✅ Check expiry
    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({
        message: "OTP expired"
      });
    }

    // ✅ Compare OTP
    const isMatch = await bcrypt.compare(otp, user.otp);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid OTP"
      });
    }

    // ✅ Verify user
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    res.json({
      success: true,
      message: "Email verified successfully"
    });

  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    res.status(500).json({ error: error.message });
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
    res.clearCookie('token', {
      httpOnly: true,
      secure: false, // true in production (HTTPS)
      sameSite: 'lax',
    });

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });

  } catch (error) {
    console.error('Logout Error:', error); // 👈 IMPORTANT
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
