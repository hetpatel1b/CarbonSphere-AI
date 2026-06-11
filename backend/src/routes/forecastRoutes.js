const express = require('express');
const router = express.Router();
const { 
  getForecastSummary, 
  getForecastTrends, 
  getForecastPredictions, 
  getForecastInsights 
} = require('../controllers/forecastController');
const { protect } = require('../middleware/authMiddleware');

router.get('/summary', protect, getForecastSummary);
router.get('/trends', protect, getForecastTrends);
router.get('/predictions', protect, getForecastPredictions);
router.get('/insights', protect, getForecastInsights);

module.exports = router;
