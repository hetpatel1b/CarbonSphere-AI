const Achievement = require('../models/Achievement');
const UserAchievement = require('../models/UserAchievement');
const Activity = require('../models/Activity');
const User = require('../models/User');
const { createNotification } = require('../controllers/notificationController');

/**
 * Calculates the maximum consecutive days of logged activities.
 */
const getConsecutiveDays = (activities) => {
  if (activities.length === 0) return 0;
  
  // Extract unique dates as YYYY-MM-DD
  const uniqueDates = [...new Set(activities.map(a => {
    const d = new Date(a.date);
    return d.toISOString().split('T')[0];
  }))].sort();

  let maxStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < uniqueDates.length; i++) {
    const prevDate = new Date(uniqueDates[i-1]);
    const currDate = new Date(uniqueDates[i]);
    
    // Difference in days
    const diffTime = Math.abs(currDate - prevDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    
    if (diffDays === 1) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return maxStreak;
};

/**
 * Core engine to evaluate rules and unlock achievements
 */
const checkAndUnlockAchievements = async (userId) => {
  try {
    // 1. Gather all required data
    const activities = await Activity.find({ userId }).sort({ date: 1 });
    const unlockedAchievements = await UserAchievement.find({ userId }).populate('achievementId');
    const allAchievements = await Achievement.find({ isActive: true });

    // 2. Pre-calculate user stats
    const activityCount = activities.length;
    const totalEmissions = activities.reduce((sum, act) => sum + act.carbonEmission, 0);
    const averageEmission = activityCount > 0 ? (totalEmissions / activityCount) : 0;
    const consecutiveDays = getConsecutiveDays(activities);

    // Track unlocked IDs to avoid duplicate processing in the loop
    const unlockedIds = new Set(unlockedAchievements.map(ua => ua.achievementId._id.toString()));

    const newlyUnlocked = [];

    // 3. Evaluate each locked achievement
    for (const achievement of allAchievements) {
      if (unlockedIds.has(achievement._id.toString())) {
        continue; // Already unlocked
      }

      const { criteria } = achievement;
      let isUnlocked = false;

      // Evaluate based on criteria type
      if (criteria && criteria.type === 'count') {
        if (activityCount >= criteria.target) {
          isUnlocked = true;
        }
      } 
      else if (criteria && criteria.type === 'consecutive_days') {
        if (consecutiveDays >= criteria.target) {
          isUnlocked = true;
        }
      }
      else if (criteria && criteria.type === 'emission_threshold') {
        if (activityCount >= criteria.minCount && averageEmission <= criteria.maxAvg) {
          isUnlocked = true;
        }
      }

      // 4. If unlocked, save and notify
      if (isUnlocked) {
        // Create UserAchievement
        const newUnlock = await UserAchievement.create({
          userId,
          achievementId: achievement._id
        });
        
        newlyUnlocked.push(newUnlock);

        // Send Notification
        await createNotification(
          userId,
          "🏆 Achievement Unlocked!",
          `You unlocked the '${achievement.title}' achievement.`,
          'achievement'
        );

        // Update User stats
        await User.findByIdAndUpdate(userId, {
          $inc: { totalAchievements: 1 }
        });
      }
    }

    return newlyUnlocked;
  } catch (error) {
    console.error('Error in achievement engine:', error);
  }
};

module.exports = {
  checkAndUnlockAchievements,
  getConsecutiveDays
};
