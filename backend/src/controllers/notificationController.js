const Notification = require('../models/Notification');

// Internal helper for other controllers
const createNotification = async (userId, title, message, type) => {
  try {
    const notification = await Notification.create({
      userId,
      title,
      message,
      type
    });
    return notification;
  } catch (error) {
    console.error(`Error creating notification: ${error.message}`);
  }
};

// @desc    Create a notification manually
// @route   POST /api/notifications
// @access  Private
const createNotificationEndpoint = async (req, res) => {
  try {
    const { title, message, type } = req.body;
    if (!title || !message || !type) {
      return res.status(400).json({ success: false, message: 'Please provide title, message, and type' });
    }
    
    const notification = await createNotification(req.user.id, title, message, type);
    return res.status(201).json({ success: true, data: notification });
  } catch (error) {
    console.error(`Error in createNotificationEndpoint: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id })
      .populate('userId', 'name email avatar')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    console.error(`Error in getMyNotifications: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get single notification
// @route   GET /api/notifications/:id
// @access  Private
const getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findOne({ _id: req.params.id, userId: req.user.id })
      .populate('userId', 'name email avatar');

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    return res.status(200).json({ success: true, data: notification });
  } catch (error) {
    console.error(`Error in getNotificationById: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Mark a notification as read
// @route   PATCH /api/notifications/read/:id
// @access  Private
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    return res.status(200).json({ success: true, data: notification });
  } catch (error) {
    console.error(`Error in markAsRead: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Mark all notifications as read
// @route   PATCH /api/notifications/read-all
// @access  Private
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user.id, isRead: false },
      { isRead: true }
    );

    return res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    console.error(`Error in markAllAsRead: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    return res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.error(`Error in deleteNotification: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  createNotification,
  createNotificationEndpoint,
  getMyNotifications,
  getNotificationById,
  markAsRead,
  markAllAsRead,
  deleteNotification
};
