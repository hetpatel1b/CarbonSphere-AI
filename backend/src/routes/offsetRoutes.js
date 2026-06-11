const express = require('express');
const router = express.Router();
const {
  createOffset,
  getMyOffsets,
  getOffsetSummary,
  getOffsetById
} = require('../controllers/offsetController');
const { protect } = require('../middleware/authMiddleware');

// Order matters: /summary must be placed above /:id
router.get('/summary', protect, getOffsetSummary);
router.post('/', protect, createOffset);
router.get('/', protect, getMyOffsets);
router.get('/:id', protect, getOffsetById);

module.exports = router;
