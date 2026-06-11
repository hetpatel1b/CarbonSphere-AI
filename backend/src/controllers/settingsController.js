const User = require('../models/User');
const Activity = require('../models/Activity');
const Challenge = require('../models/Challenge');
const Simulation = require('../models/Simulation');
const bcrypt = require('bcryptjs');

// @desc    Get user profile & settings
// @route   GET /api/settings/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/settings/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, email, location, timezone, avatar } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (name) user.name = name;
    if (email) user.email = email;
    if (location !== undefined) user.location = location;
    if (timezone !== undefined) user.timezone = timezone;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();
    return res.status(200).json({ success: true, data: {
      name: user.name,
      email: user.email,
      location: user.location,
      timezone: user.timezone,
      avatar: user.avatar
    }});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Update preferences
// @route   PUT /api/settings/preferences
// @access  Private
const updatePreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.preferences = { ...user.preferences, ...req.body };
    await user.save();

    return res.status(200).json({ success: true, data: user.preferences });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Update notifications
// @route   PUT /api/settings/notifications
// @access  Private
const updateNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.notifications = { ...user.notifications, ...req.body };
    await user.save();

    return res.status(200).json({ success: true, data: user.notifications });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Update password
// @route   PUT /api/settings/password
// @access  Private
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Provide both current and new password' });
    }

    const user = await User.findById(req.user.id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect current password' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Export User Data
// @route   GET /api/settings/export
// @access  Private
const exportData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const activities = await Activity.find({ userId: req.user.id });
    const challenges = await Challenge.find({ 'participants.userId': req.user.id });
    const simulations = await Simulation.find({ userId: req.user.id });

    const exportBlob = {
      profile: user,
      activities,
      challenges,
      simulations,
      exportDate: new Date()
    };

    return res.status(200).json({ success: true, data: exportBlob });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Delete Account
// @route   DELETE /api/settings/account
// @access  Private
const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    // Basic cascading deletes
    await Activity.deleteMany({ userId });
    await Simulation.deleteMany({ userId });
    await User.findByIdAndDelete(userId);

    return res.status(200).json({ success: true, message: 'Account deleted' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updatePreferences,
  updateNotifications,
  updatePassword,
  exportData,
  deleteAccount
};
