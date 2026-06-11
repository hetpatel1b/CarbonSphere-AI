const express = require('express');
const router = express.Router();
const { applyAction, getActiveActions } = require('../controllers/actionController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/apply', applyAction);
router.get('/active', getActiveActions);

module.exports = router;
