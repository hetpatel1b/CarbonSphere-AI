const express = require('express');
const router = express.Router();
const { 
  getCommunityStats,
  getLeaderboard,
  getCommunityFeed,
  getCommunityChallenges,
  joinChallenge
} = require('../controllers/communityController');
const { protect } = require('../middleware/authMiddleware');

router.get('/stats', protect, getCommunityStats);
router.get('/leaderboard', protect, getLeaderboard);
router.get('/feed', protect, getCommunityFeed);
router.get('/challenges', protect, getCommunityChallenges);
router.post('/challenges/:id/join', protect, joinChallenge);

module.exports = router;
