const express = require('express');
const router = express.Router();
const { verifyUser } = require('../middlewares/auth');
const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
  forgotPassword,
  verifyOTP,
  resetPassword
} = require('../controllers/userController');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Password reset routes (public)
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);

// Protected routes (require user authentication)
router.get('/profile', verifyUser, getProfile);
router.put('/profile', verifyUser, updateProfile);
router.put('/change-password', verifyUser, changePassword);
router.delete('/delete', verifyUser, deleteAccount);

module.exports = router;
