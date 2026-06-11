const express = require('express');
const router = express.Router();
const { analyzeWithAI, getMyRecommendations } = require('../controllers/recommendationController');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');

// POST /api/ai-coach/analyze
router.post('/analyze', protect, analyzeWithAI);

// GET /api/ai-coach/latest
router.get('/latest', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    // getMyRecommendations is inside recommendationController but it outputs directly to res.
    // Let's just fetch recommendations here to combine them.
    const Recommendation = require('../models/Recommendation');
    const recommendations = await Recommendation.find({ userId: req.user.id }).sort({ priority: 1, generatedAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        insight: user.aiInsight || null,
        recommendations
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
