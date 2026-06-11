const express = require('express');
const router = express.Router();
const {
  generateReport,
  getMyReports,
  getReportById,
  deleteReport
} = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

router.post('/generate', protect, generateReport);
router.get('/', protect, getMyReports);
router.get('/:id', protect, getReportById);
router.delete('/:id', protect, deleteReport);

module.exports = router;
