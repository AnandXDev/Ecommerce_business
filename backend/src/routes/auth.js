const express = require('express');
const router = express.Router();

// Import controllers
const authController = require('../controllers/authController');
const { sendOTP, verifyOTP } = require('../controllers/authController');

// Import validation
const {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  updatePasswordValidator,
  updateProfileValidator
} = require('../validators/authValidator');

// Import middleware
const { protect, verifyEmailToken, verifyResetToken } = require('../middleware/auth');

// Public routes
router.post('/register', registerValidator, authController.signup);
router.post('/login', loginValidator, authController.login);
router.post('/logout', authController.logout);
router.get('/verify-email/', authController.verifyEmail);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
// router.post('/google-login', authController.googleLogin);
// router.post('/google', authController.googleAuth);
// router.post('/forgot-password', forgotPasswordValidator, authController.forgotPassword);
// router.patch('/reset-password/:token', resetPasswordValidator, authController.resetPassword);
// router.get('/verify-email/:token', verifyEmailToken, authController.verifyEmail);
// router.post('/resend-verification', authController.resendVerification);
// router.get('/check-email/:email', authController.checkEmail);

// Protected routes
router.use(protect); // All routes below this require authentication

router.get('/me', authController.getMe);
router.patch('/update-me', updateProfileValidator, authController.updateMe);
router.patch('/update-password', updatePasswordValidator, authController.updatePassword);
router.delete('/delete-me', authController.deleteMe);

router.post('/refresh-token', authController.refreshToken);

module.exports = router;
