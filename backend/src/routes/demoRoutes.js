const express = require('express');
const router = express.Router();
const seedDemoData = require('../../scripts/seedDemoData');

// POST /api/demo/reset
// Resets the demo data for the demo user
router.post('/reset', async (req, res) => {
  try {
    console.log('Demo Reset requested');
    await seedDemoData();
    res.status(200).json({ success: true, message: 'Demo data reset successfully' });
  } catch (error) {
    console.error('Demo reset error:', error);
    res.status(500).json({ success: false, message: 'Failed to reset demo data', error: error.message });
  }
});

module.exports = router;
