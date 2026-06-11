const Achievement = require('../models/Achievement');
const UserAchievement = require('../models/UserAchievement');
const User = require('../models/User');
const { createNotification } = require('./notificationController');
const Activity = require('../models/Activity');
const { getConsecutiveDays } = require('../services/achievementEngine'); // We need to export this from the engine

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

// @desc    Get achievement status with progress
// @route   GET /api/achievements/status
// @access  Private
const getAchievementStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // 1. Fetch DB data
    const allAchievements = await Achievement.find({ isActive: true });
    const userAchievements = await UserAchievement.find({ userId });
    const activities = await Activity.find({ userId }).sort({ date: 1 });
    
    // 2. Compute user stats
    const activityCount = activities.length;
    const totalEmissions = activities.reduce((sum, act) => sum + act.carbonEmission, 0);
    const averageEmission = activityCount > 0 ? (totalEmissions / activityCount) : 0;
    
    // Quick inline consecutive days calculation if we don't import it
    const uniqueDates = [...new Set(activities.map(a => new Date(a.date).toISOString().split('T')[0]))].sort();
    let maxStreak = 1; let currentStreak = 1;
    if (uniqueDates.length === 0) maxStreak = 0;
    for (let i = 1; i < uniqueDates.length; i++) {
      const diffDays = Math.ceil(Math.abs(new Date(uniqueDates[i]) - new Date(uniqueDates[i-1])) / (1000 * 60 * 60 * 24)); 
      if (diffDays === 1) { currentStreak++; maxStreak = Math.max(maxStreak, currentStreak); } else { currentStreak = 1; }
    }
    const consecutiveDays = maxStreak;

    // 3. Map into progress objects
    const statusData = allAchievements.map(achievement => {
      const unlockedRecord = userAchievements.find(ua => ua.achievementId.toString() === achievement._id.toString());
      const isUnlocked = !!unlockedRecord;
      let progress = 0;

      if (isUnlocked) {
        progress = 100;
      } else {
        const criteria = achievement.criteria || {};
        if (criteria.type === 'count') {
          progress = Math.min(Math.round((activityCount / criteria.target) * 100), 99);
        } else if (criteria.type === 'consecutive_days') {
          progress = Math.min(Math.round((consecutiveDays / criteria.target) * 100), 99);
        } else if (criteria.type === 'emission_threshold') {
          if (activityCount < criteria.minCount) {
            progress = Math.min(Math.round((activityCount / criteria.minCount) * 50), 49);
          } else {
            // They have enough activities, now depends on average
            progress = averageEmission <= criteria.maxAvg ? 100 : 75; // 75% means close but needs improvement
          }
        }
      }

      return {
        ...achievement.toObject(),
        unlocked: isUnlocked,
        progress,
        unlockedAt: unlockedRecord ? unlockedRecord.unlockedAt : null
      };
    });

    return res.status(200).json({
      success: true,
      data: statusData
    });
  } catch (error) {
    console.error(`Error in getAchievementStatus: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  getAllAchievements,
  getMyAchievements,
  unlockAchievement,
  getAchievementStatus
};
