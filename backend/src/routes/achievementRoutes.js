const express = require('express');
const router = express.Router();
const {
  getAllAchievements,
  getMyAchievements,
  unlockAchievement
} = require('../controllers/achievementController');
const { protect } = require('../middleware/authMiddleware');

router.get('/my', protect, getMyAchievements);
router.get('/', protect, getAllAchievements);
router.post('/unlock/:achievementId', protect, unlockAchievement);

module.exports = router;
