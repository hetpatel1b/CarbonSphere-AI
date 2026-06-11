const express = require('express');
const router = express.Router();
const {
  generateMonthlyReport,
  generateWeeklyReport,
  generateSummaryReport,
  getMyReports,
  getReportById
} = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

router.post('/generate/monthly', protect, generateMonthlyReport);
router.post('/generate/weekly', protect, generateWeeklyReport);
router.post('/generate/summary', protect, generateSummaryReport);

router.get('/', protect, getMyReports);
router.get('/:id', protect, getReportById);

module.exports = router;
