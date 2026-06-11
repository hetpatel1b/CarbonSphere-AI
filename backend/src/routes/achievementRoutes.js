const express = require('express');
const router = express.Router();
const {
  getAllAchievements,
  getMyAchievements,
  unlockAchievement,
  getAchievementStatus
} = require('../controllers/achievementController');
const { protect } = require('../middleware/authMiddleware');

router.get('/my', protect, getMyAchievements);
router.get('/status', protect, getAchievementStatus);
router.get('/', protect, getAllAchievements);
router.post('/unlock/:achievementId', protect, unlockAchievement);

module.exports = router;
