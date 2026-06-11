const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getProfile,
  updateProfile,
  updatePreferences,
  updateNotifications,
  updatePassword,
  exportData,
  deleteAccount
} = require('../controllers/settingsController');

router.use(protect); // All routes require authentication

router.route('/profile')
  .get(getProfile)
  .put(updateProfile);

router.put('/preferences', updatePreferences);
router.put('/notifications', updateNotifications);
router.put('/password', updatePassword);
router.get('/export', exportData);
router.delete('/account', deleteAccount);

module.exports = router;
