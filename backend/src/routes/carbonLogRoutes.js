const express = require('express');
const router = express.Router();
const {
  createCarbonLog,
  getCarbonLogs,
  getCarbonSummary
} = require('../controllers/carbonLogController');
const { protect } = require('../middleware/authMiddleware');

router.get('/summary', protect, getCarbonSummary);

router.route('/')
  .post(protect, createCarbonLog)
  .get(protect, getCarbonLogs);

module.exports = router;
