const express = require('express');
const router = express.Router();
const { verifyRecruiter } = require('../middlewares/auth');
const {
  createJob,
  getAllApprovedJobs,
  getJobById,
  getJobsByCategory,
  getLatestJobs,
  getLocations,
  getCategoryStats,
  updateJob,
  deleteJob
} = require('../controllers/jobController');

// Public routes
router.get('/', getAllApprovedJobs);
router.get('/latest', getLatestJobs);
router.get('/filters/locations', getLocations);
router.get('/stats/categories', getCategoryStats);
router.get('/category/:category', getJobsByCategory);
router.get('/:jobId', getJobById);

// Protected routes (require recruiter authentication)
router.post('/create', verifyRecruiter, createJob);
router.put('/:jobId', verifyRecruiter, updateJob);
router.delete('/:jobId', verifyRecruiter, deleteJob);

module.exports = router;
