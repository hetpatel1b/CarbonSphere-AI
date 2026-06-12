const express = require('express');
const router = express.Router();
const { 
  getUnifiedForecast,
  generateForecast
} = require('../controllers/forecastController');
const { protect } = require('../middleware/authMiddleware');

router.get('/data', protect, getUnifiedForecast);
router.post('/generate', protect, generateForecast);

module.exports = router;
