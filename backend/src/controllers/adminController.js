const User = require('../models/User');
const Activity = require('../models/Activity');
const Challenge = require('../models/Challenge');
const Report = require('../models/Report');
const Achievement = require('../models/Achievement');
const Offset = require('../models/Offset');
const Notification = require('../models/Notification');
const CarbonLog = require('../models/CarbonLog');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    return res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    console.error(`Error in getAllUsers: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get single user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error(`Error in getUserById: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get all activities
// @route   GET /api/admin/activities
// @access  Private/Admin
const getAllActivities = async (req, res) => {
  try {
    const activities = await Activity.find({})
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: activities.length, data: activities });
  } catch (error) {
    console.error(`Error in getAllActivities: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get all challenges
// @route   GET /api/admin/challenges
// @access  Private/Admin
const getAllChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find({}).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: challenges.length, data: challenges });
  } catch (error) {
    console.error(`Error in getAllChallenges: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get all reports
// @route   GET /api/admin/reports
// @access  Private/Admin
const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find({})
      .populate('userId', 'name email')
      .sort({ generatedAt: -1 });
    return res.status(200).json({ success: true, count: reports.length, data: reports });
  } catch (error) {
    console.error(`Error in getAllReports: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get platform analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getPlatformAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalActivities = await Activity.countDocuments();
    const totalChallenges = await Challenge.countDocuments();
    const totalReports = await Report.countDocuments();
    const totalAchievements = await Achievement.countDocuments();
    const totalOffsets = await Offset.countDocuments();
    const totalNotifications = await Notification.countDocuments();

    const carbonAgg = await CarbonLog.aggregate([
      { $group: { _id: null, total: { $sum: '$carbonEmission' } } }
    ]);
    const totalCarbonLogged = carbonAgg.length > 0 ? carbonAgg[0].total : 0;

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalActivities,
        totalChallenges,
        totalReports,
        totalAchievements,
        totalOffsets,
        totalNotifications,
        totalCarbonLogged
      }
    });
  } catch (error) {
    console.error(`Error in getPlatformAnalytics: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  getAllActivities,
  getAllChallenges,
  getAllReports,
  getPlatformAnalytics
};
