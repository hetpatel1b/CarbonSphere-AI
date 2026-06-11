const express = require('express');
const router = express.Router();
const {
  runSimulation,
  getSimulationHistory
} = require('../controllers/simulatorController');
const { protect } = require('../middleware/authMiddleware');

router.post('/run', protect, runSimulation);
router.get('/history', protect, getSimulationHistory);

module.exports = router;
