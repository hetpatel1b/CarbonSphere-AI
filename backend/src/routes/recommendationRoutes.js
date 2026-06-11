const express = require('express');
const router = express.Router();
const {
  generateRecommendations,
  getMyRecommendations,
  getRecommendationById,
  markAsRead
} = require('../controllers/recommendationController');
const { protect } = require('../middleware/authMiddleware');

router.post('/generate', protect, generateRecommendations);
router.get('/', protect, getMyRecommendations);
router.get('/:id', protect, getRecommendationById);
router.patch('/read/:id', protect, markAsRead);

module.exports = router;
