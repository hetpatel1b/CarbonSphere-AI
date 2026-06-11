const Challenge = require('../models/Challenge');
const UserChallenge = require('../models/UserChallenge');
const Activity = require('../models/Activity');
const User = require('../models/User');
const { createNotification } = require('../controllers/notificationController');

/**
 * Calculates the maximum consecutive days of logged activities within a date range.
 * If range is not provided, checks all activities.
 */
const getConsecutiveDaysInRange = (activities, startDate, endDate) => {
  const filtered = activities.filter(a => {
    const d = new Date(a.date);
    return d >= new Date(startDate) && d <= new Date(endDate);
  });
  
  if (filtered.length === 0) return 0;
  
  const uniqueDates = [...new Set(filtered.map(a => {
    const d = new Date(a.date);
    return d.toISOString().split('T')[0];
  }))].sort();

  let maxStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < uniqueDates.length; i++) {
    const prevDate = new Date(uniqueDates[i-1]);
    const currDate = new Date(uniqueDates[i]);
    
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
 * Core engine to evaluate rules and update challenge progress
 */
const checkAndUpdateChallenges = async (userId) => {
  try {
    // 1. Gather active challenges the user has joined but hasn't completed
    const activeUserChallenges = await UserChallenge.find({ 
      userId, 
      completed: false 
    }).populate('challengeId');

    if (activeUserChallenges.length === 0) {
      return []; // Nothing to check
    }

    // 2. Gather activities for the user
    // We only need activities since the earliest challenge joinedAt or startDate
    const activities = await Activity.find({ userId }).sort({ date: 1 });
    
    const newlyCompleted = [];

    // 3. Evaluate each active joined challenge
    for (const userChallenge of activeUserChallenges) {
      const challenge = userChallenge.challengeId;
      
      // Skip if challenge itself is deactivated or past end date
      if (!challenge || !challenge.isActive || new Date() > new Date(challenge.endDate)) {
        continue;
      }

      const { criteria, targetValue, startDate, endDate } = challenge;
      
      // Filter activities that occurred during this challenge's active window
      const relevantActivities = activities.filter(a => {
        const d = new Date(a.date);
        return d >= new Date(startDate) && d <= new Date(endDate);
      });

      let currentProgress = userChallenge.progress;

      // Evaluate based on criteria type
      if (criteria && criteria.type === 'category_count') {
        const count = relevantActivities.filter(a => a.category === criteria.category).length;
        currentProgress = count;
      } 
      else if (criteria && criteria.type === 'consecutive_days') {
        currentProgress = getConsecutiveDaysInRange(activities, startDate, endDate);
      }
      else if (criteria && criteria.type === 'emission_reduction') {
        // Example: Reduce emissions by targetValue%
        // We'll calculate a simplified progress: if they have activities with lower avg emissions compared to history
        // Actually, for a simple implementation, let's just count activities where carbonEmission < threshold
        if (criteria.baseline) {
           const reducedCount = relevantActivities.filter(a => a.carbonEmission < criteria.baseline).length;
           currentProgress = Math.min(reducedCount * (targetValue / criteria.requiredCount || 10), targetValue);
        } else {
           // Fallback logic if baseline not set
           currentProgress = Math.min(relevantActivities.length * 2, targetValue); 
        }
      }
      else if (criteria && criteria.type === 'community_actions') {
        const count = relevantActivities.filter(a => ['Community', 'Other'].includes(a.category)).length;
        currentProgress = count;
      }

      // Ensure progress doesn't exceed target
      if (currentProgress > targetValue) {
        currentProgress = targetValue;
      }

      // Check if progress changed
      if (currentProgress !== userChallenge.progress) {
        userChallenge.progress = currentProgress;
        
        // 4. Check if completed
        if (currentProgress >= targetValue) {
          userChallenge.completed = true;
          
          // Send Notification
          await createNotification(
            userId,
            "🏆 Challenge Completed!",
            `You completed the '${challenge.title}' challenge and earned ${challenge.rewardPoints} XP!`,
            'challenge'
          );

          // Update User points (assuming totalAchievements could be reused or add totalPoints)
          await User.findByIdAndUpdate(userId, {
            $inc: { totalAchievements: 1 } // For now, reuse totalAchievements or generic XP
          });

          newlyCompleted.push(challenge);
        }

        await userChallenge.save();
      }
    }

    return newlyCompleted;
  } catch (error) {
    console.error('Error in challenge engine:', error);
    return [];
  }
};

module.exports = {
  checkAndUpdateChallenges,
  getConsecutiveDaysInRange
};
