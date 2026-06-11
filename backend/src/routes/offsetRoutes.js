const express = require('express');
const router = express.Router();
const {
  getProjects,
  getRecommendations,
  purchaseOffset,
  getHistory,
  getStats
} = require('../controllers/offsetController');
const { protect } = require('../middleware/authMiddleware');

router.get('/projects', protect, getProjects);
router.get('/recommendations', protect, getRecommendations);
router.post('/purchase', protect, purchaseOffset);
router.get('/history', protect, getHistory);
router.get('/stats', protect, getStats);

module.exports = router;
