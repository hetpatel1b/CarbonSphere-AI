const express = require('express');
const router = express.Router();
const {
  getAllChallenges,
  getMyChallenges,
  getChallengeById,
  joinChallenge,
  updateChallengeProgress,
  getChallengeStatus
} = require('../controllers/challengeController');
const { protect } = require('../middleware/authMiddleware');

// Note: /my and /status must come before /:id to prevent being parsed as an id parameter
router.get('/my', protect, getMyChallenges);
router.get('/status', protect, getChallengeStatus);
router.get('/', protect, getAllChallenges);
router.get('/:id', protect, getChallengeById);
router.post('/join/:id', protect, joinChallenge);
router.patch('/progress/:id', protect, updateChallengeProgress);

module.exports = router;
