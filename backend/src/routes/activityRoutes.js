const express = require('express');
const router = express.Router();
const {
  createActivity,
  getActivities,
  getActivityById,
  updateActivity,
  deleteActivity
} = require('../controllers/activityController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createActivity)
  .get(protect, getActivities);

router.route('/:id')
  .get(protect, getActivityById)
  .put(protect, updateActivity)
  .delete(protect, deleteActivity);

module.exports = router;
