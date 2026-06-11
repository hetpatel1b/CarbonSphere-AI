const express = require('express');
const router = express.Router();
const { getMonthlyForecast, getYearlyForecast, getForecastTrends } = require('../controllers/forecastController');
const { protect } = require('../middleware/authMiddleware');

router.get('/monthly', protect, getMonthlyForecast);
router.get('/yearly', protect, getYearlyForecast);
router.get('/trends', protect, getForecastTrends);

module.exports = router;
