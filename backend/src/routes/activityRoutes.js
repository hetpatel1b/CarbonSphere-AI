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
const validate = require('../middleware/validate');
const activitySchemas = require('../validations/activity.schema');

// Routes
router.route('/')
  .post(protect, validate(activitySchemas.logActivity), createActivity)
  .get(protect, getActivities);

router.route('/:id')
  .get(protect, getActivityById)
  .put(protect, updateActivity)
  .delete(protect, deleteActivity);

module.exports = router;
