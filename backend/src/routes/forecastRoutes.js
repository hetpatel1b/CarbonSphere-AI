const express = require('express');
const router = express.Router();
const { 
  getUnifiedForecast
} = require('../controllers/forecastController');
const { protect } = require('../middleware/authMiddleware');

router.get('/data', protect, getUnifiedForecast);

module.exports = router;
