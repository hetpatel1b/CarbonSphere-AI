const express = require('express');
const router = express.Router();
const {
  createNotificationEndpoint,
  getMyNotifications,
  getNotificationById,
  markAsRead,
  markAllAsRead,
  deleteNotification
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.patch('/read-all', protect, markAllAsRead);
router.patch('/read/:id', protect, markAsRead);
router.post('/', protect, createNotificationEndpoint);
router.get('/', protect, getMyNotifications);
router.get('/:id', protect, getNotificationById);
router.delete('/:id', protect, deleteNotification);

module.exports = router;
