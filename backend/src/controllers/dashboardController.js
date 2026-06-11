const Activity = require('../models/Activity');
const CarbonLog = require('../models/CarbonLog');
const UserAchievement = require('../models/UserAchievement');
const mongoose = require('mongoose');

// @desc    Get dashboard summary
// @route   GET /api/dashboard/summary
// @access  Private
const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const objectIdUser = new mongoose.Types.ObjectId(userId);

    // totalActivities
    const totalActivities = await Activity.countDocuments({ userId });

    // totalCarbon (from CarbonLog)
    const totalCarbonAgg = await CarbonLog.aggregate([
      { $match: { userId: objectIdUser } },
      { $group: { _id: null, total: { $sum: '$carbonEmission' } } }
    ]);
    const totalCarbon = totalCarbonAgg.length > 0 ? totalCarbonAgg[0].total : 0;

    // currentMonthCarbon
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const currentMonthAgg = await Activity.aggregate([
      { 
        $match: { 
          userId: objectIdUser,
          date: { $gte: startOfMonth }
        } 
      },
      { $group: { _id: null, total: { $sum: '$carbonEmission' } } }
    ]);
    const currentMonthCarbon = currentMonthAgg.length > 0 ? currentMonthAgg[0].total : 0;

    // currentWeekCarbon
    const startOfWeek = new Date();
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);

    const currentWeekAgg = await Activity.aggregate([
      { 
        $match: { 
          userId: objectIdUser,
          date: { $gte: startOfWeek }
        } 
      },
      { $group: { _id: null, total: { $sum: '$carbonEmission' } } }
    ]);
    const currentWeekCarbon = currentWeekAgg.length > 0 ? currentWeekAgg[0].total : 0;

    // sustainabilityScore
    let sustainabilityScore = 50; 
    if (totalActivities > 0) {
       const avgCarbon = totalCarbon / totalActivities;
       // Assuming lower avg carbon is better. Dummy heuristic calculation.
       sustainabilityScore = Math.max(0, Math.min(100, 100 - (avgCarbon / 10) + (totalActivities * 2)));
       sustainabilityScore = Math.round(sustainabilityScore);
    } else {
       sustainabilityScore = 0;
    }

    // Achievements
    const userAchievements = await UserAchievement.find({ userId }).populate('achievementId').sort({ unlockedAt: -1 });
    const totalAchievementsUnlocked = userAchievements.length;
    const latestAchievement = totalAchievementsUnlocked > 0 ? userAchievements[0].achievementId : null;

    // Challenges
    const UserChallenge = require('../models/UserChallenge');
    const userChallenges = await UserChallenge.find({ userId }).populate('challengeId');
    
    // An active challenge is joined but not completed, and the challenge itself is active and not expired
    const now = new Date();
    const activeChallengesCount = userChallenges.filter(uc => 
      !uc.completed && uc.challengeId && uc.challengeId.isActive && new Date(uc.challengeId.endDate) > now
    ).length;
    const completedChallengesCount = userChallenges.filter(uc => uc.completed).length;

    // Latest AI Insight
    const User = require('../models/User');
    const user = await User.findById(userId);
    const aiInsight = user.aiInsight || null;

    return res.status(200).json({
      success: true,
      data: {
        totalActivities,
        totalCarbon,
        sustainabilityScore,
        currentMonthCarbon,
        currentWeekCarbon,
        totalAchievementsUnlocked,
        latestAchievement,
        activeChallengesCount,
        completedChallengesCount,
        aiInsight
      }
    });

  } catch (error) {
    console.error(`Error in getDashboardSummary: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get dashboard analytics
// @route   GET /api/dashboard/analytics
// @access  Private
const getDashboardAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const objectIdUser = new mongoose.Types.ObjectId(userId);

    // carbon trend data & monthly totals (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0,0,0,0);

    const monthlyTotalsAgg = await Activity.aggregate([
      { 
        $match: { 
          userId: objectIdUser,
          date: { $gte: sixMonthsAgo }
        } 
      },
      {
        $group: {
          _id: { 
            year: { $year: '$date' }, 
            month: { $month: '$date' } 
          },
          totalCarbon: { $sum: '$carbonEmission' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const monthlyTotals = monthlyTotalsAgg.map(item => ({
      month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
      totalCarbon: item.totalCarbon,
      activitiesCount: item.count
    }));

    // category breakdown
    const categoryBreakdownAgg = await Activity.aggregate([
      { $match: { userId: objectIdUser } },
      {
        $group: {
          _id: '$category',
          totalCarbon: { $sum: '$carbonEmission' }
        }
      },
      { $sort: { totalCarbon: -1 } }
    ]);

    const categoryBreakdown = categoryBreakdownAgg.map(item => ({
      category: item._id,
      totalCarbon: item.totalCarbon
    }));

    // recent activities (last 5)
    const recentActivities = await Activity.find({ userId })
      .sort({ date: -1 })
      .limit(5);

    return res.status(200).json({
      success: true,
      data: {
        carbonTrend: monthlyTotals,
        monthlyTotals,
        categoryBreakdown,
        recentActivities
      }
    });

  } catch (error) {
    console.error(`Error in getDashboardAnalytics: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

module.exports = {
  getDashboardSummary,
  getDashboardAnalytics
};
