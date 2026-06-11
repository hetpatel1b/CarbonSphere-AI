const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  getAllActivities,
  getAllChallenges,
  getAllReports,
  getPlatformAnalytics
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// Apply protect and admin middleware to all routes in this file
router.use(protect, admin);

router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);

router.get('/activities', getAllActivities);
router.get('/challenges', getAllChallenges);
router.get('/reports', getAllReports);
router.get('/analytics', getPlatformAnalytics);

module.exports = router;
