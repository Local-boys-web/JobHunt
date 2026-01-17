const express = require('express');
const router = express.Router();
const { verifyAdmin } = require('../middlewares/auth');
const {
  adminLogin,
  createAdmin,
  adminPostJob,
  getDashboardStats,
  getPendingJobs,
  approveJob,
  rejectJob,
  getAllJobs,
  deleteJob,
  getAllCompanies,
  getAllUsers,
  updateProfile,
  changePassword
} = require('../controllers/adminController');

// Public routes
router.post('/login', adminLogin);

// Protected routes (require admin authentication)
router.post('/create', verifyAdmin, createAdmin);
router.post('/jobs/create', verifyAdmin, adminPostJob); // Admin post job with auto-approval
router.get('/dashboard', verifyAdmin, getDashboardStats);
router.get('/jobs/pending', verifyAdmin, getPendingJobs);
router.put('/jobs/:jobId/approve', verifyAdmin, approveJob);
router.put('/jobs/:jobId/reject', verifyAdmin, rejectJob);
router.get('/jobs', verifyAdmin, getAllJobs);
router.delete('/jobs/:jobId', verifyAdmin, deleteJob);
router.get('/companies', verifyAdmin, getAllCompanies);
router.get('/users', verifyAdmin, getAllUsers);
router.put('/profile', verifyAdmin, updateProfile);
router.put('/change-password', verifyAdmin, changePassword);

module.exports = router;
