const Achievement = require('../models/Achievement');
const UserAchievement = require('../models/UserAchievement');
const User = require('../models/User');
const { createNotification } = require('./notificationController');

// @desc    Get all active achievements
// @route   GET /api/achievements
// @access  Private
const getAllAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find({ isActive: true }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: achievements.length,
      data: achievements
    });
  } catch (error) {
    console.error(`Error in getAllAchievements: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get user's unlocked achievements
// @route   GET /api/achievements/my
// @access  Private
const getMyAchievements = async (req, res) => {
  try {
    const userId = req.user.id;
    const myAchievements = await UserAchievement.find({ userId })
      .populate('achievementId')
      .sort({ unlockedAt: -1 });

    return res.status(200).json({
      success: true,
      count: myAchievements.length,
      data: myAchievements
    });
  } catch (error) {
    console.error(`Error in getMyAchievements: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Unlock an achievement
// @route   POST /api/achievements/unlock/:achievementId
// @access  Private
const unlockAchievement = async (req, res) => {
  try {
    const achievementId = req.params.achievementId;
    const userId = req.user.id;

    // Check if achievement exists
    const achievement = await Achievement.findById(achievementId);
    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      });
    }

    if (!achievement.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Achievement is not active'
      });
    }

    // Check if already unlocked
    const existing = await UserAchievement.findOne({ userId, achievementId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Achievement already unlocked'
      });
    }

    // Unlock achievement
    const userAchievement = await UserAchievement.create({
      userId,
      achievementId
    });

    // Trigger Notification
    await createNotification(
      userId,
      "Achievement Unlocked!",
      `You unlocked the '${achievement.title}' achievement.`,
      'achievement'
    );

    // Update user stats
    await User.findByIdAndUpdate(userId, {
      $inc: { totalAchievements: 1 }
    });

    return res.status(201).json({
      success: true,
      data: userAchievement
    });
  } catch (error) {
    console.error(`Error in unlockAchievement: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

module.exports = {
  getAllAchievements,
  getMyAchievements,
  unlockAchievement
};
