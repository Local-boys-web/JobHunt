const express = require('express');
const router = express.Router();
const { verifyRecruiter } = require('../middlewares/auth');
const {
  registerRecruiter,
  loginRecruiter,
  verifyEmail,
  resendEmailVerificationOTP,
  getDashboardStats,
  getMyJobs,
  updateProfile,
  changePassword,
  forgotPassword,
  verifyOTP,
  resetPassword
} = require('../controllers/recruiterController');

// Public routes
router.post('/register', registerRecruiter);
router.post('/login', loginRecruiter);

// Email verification routes (public)
router.post('/verify-email', verifyEmail);
router.post('/resend-verification-otp', resendEmailVerificationOTP);

// Password reset routes (public)
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);

// Protected routes (require recruiter authentication)
router.get('/dashboard', verifyRecruiter, getDashboardStats);
router.get('/my-jobs', verifyRecruiter, getMyJobs);
router.put('/profile', verifyRecruiter, updateProfile);
router.put('/change-password', verifyRecruiter, changePassword);

module.exports = router;
