const express = require('express');
const router = express.Router();
const { chatWithAssistant } = require('../controllers/assistantController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/assistant/chat
router.post('/chat', protect, chatWithAssistant);

module.exports = router;
