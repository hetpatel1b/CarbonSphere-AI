const express = require('express');
const router = express.Router();
const {
  getAllChallenges,
  getMyChallenges,
  getChallengeById,
  joinChallenge,
  updateChallengeProgress
} = require('../controllers/challengeController');
const { protect } = require('../middleware/authMiddleware');

// Note: /my must come before /:id to prevent 'my' from being parsed as an id parameter
router.get('/my', protect, getMyChallenges);
router.get('/', protect, getAllChallenges);
router.get('/:id', protect, getChallengeById);
router.post('/join/:id', protect, joinChallenge);
router.patch('/progress/:id', protect, updateChallengeProgress);

module.exports = router;
