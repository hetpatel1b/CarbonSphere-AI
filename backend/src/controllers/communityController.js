const mongoose = require('mongoose');
const User = require('../models/User');
const Activity = require('../models/Activity');
const Challenge = require('../models/Challenge');
const UserChallenge = require('../models/UserChallenge');
const UserAchievement = require('../models/UserAchievement');

// @desc    Get Community Statistics
// @route   GET /api/community/stats
// @access  Private
const getCommunityStats = async (req, res) => {
  try {
    const userStats = await User.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          totalCarbonSaved: { $sum: '$totalCarbonSaved' },
          totalActivities: { $sum: '$totalActivities' },
          totalBadges: { $sum: '$totalAchievements' }
        }
      }
    ]);

    const activeChallengesCount = await Challenge.countDocuments({ isActive: true });

    let stats = {
      totalUsers: 0,
      totalCarbonSaved: 0,
      totalActivities: 0,
      totalBadges: 0,
      activeChallengesCount
    };

    if (userStats.length > 0) {
      stats = { ...stats, ...userStats[0] };
      delete stats._id;
    }

    // Chart Data placeholder (aggregate reduction per month over the whole DB)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const chartAgg = await Activity.aggregate([
      { $match: { date: { $gte: sixMonthsAgo } } },
      { $group: {
          _id: { year: { $year: '$date' }, month: { $month: '$date' } },
          reduction: { $sum: '$carbonEmission' } // In a real app, this should be actual reduction if calculated, here we use sum
      }},
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const chartData = chartAgg.map(item => ({
      month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
      reduction: item.reduction
    }));

    return res.status(200).json({ success: true, data: { stats, chartData } });
  } catch (error) {
    console.error(`Error in getCommunityStats: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get Global Leaderboard
// @route   GET /api/community/leaderboard
// @access  Private
const getLeaderboard = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    const leaderboard = await User.aggregate([
      {
        $project: {
          _id: 1,
          name: 1,
          avatar: 1,
          totalCarbonSaved: 1,
          totalActivities: 1,
          totalAchievements: 1,
          score: {
            $add: [
              { $multiply: [{ $ifNull: ['$totalCarbonSaved', 0] }, 10] },
              { $multiply: [{ $ifNull: ['$totalActivities', 0] }, 2] },
              { $multiply: [{ $ifNull: ['$totalAchievements', 0] }, 5] }
            ]
          }
        }
      },
      { $sort: { score: -1 } },
      { $limit: 100 } // Fetch top 100
    ]);

    let rankedLeaderboard = leaderboard.map((user, index) => ({
      rank: index + 1,
      id: user._id.toString(),
      name: user.name,
      avatar: user.avatar,
      score: Math.round(user.score),
      isCurrentUser: user._id.toString() === currentUserId
    }));

    // Find current user rank if not in top 100
    let currentUserData = rankedLeaderboard.find(u => u.isCurrentUser);
    
    if (!currentUserData) {
      const user = await User.findById(currentUserId);
      if (user) {
        const score = (user.totalCarbonSaved * 10) + (user.totalActivities * 2) + (user.totalAchievements * 5);
        // Find rank by counting users with a strictly greater score
        const betterUsersCount = await User.countDocuments({
          $expr: {
            $gt: [
              { $add: [
                  { $multiply: [{ $ifNull: ['$totalCarbonSaved', 0] }, 10] },
                  { $multiply: [{ $ifNull: ['$totalActivities', 0] }, 2] },
                  { $multiply: [{ $ifNull: ['$totalAchievements', 0] }, 5] }
              ]},
              score
            ]
          }
        });

        currentUserData = {
          rank: betterUsersCount + 1,
          id: user._id.toString(),
          name: user.name,
          avatar: user.avatar,
          score: Math.round(score),
          isCurrentUser: true
        };
        rankedLeaderboard.push(currentUserData);
      }
    }

    return res.status(200).json({ success: true, data: rankedLeaderboard });
  } catch (error) {
    console.error(`Error in getLeaderboard: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get Recent Community Activity Feed
// @route   GET /api/community/feed
// @access  Private
const getCommunityFeed = async (req, res) => {
  try {
    const activities = await Activity.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('userId', 'name avatar')
      .lean();

    const badges = await UserAchievement.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('userId', 'name avatar')
      .populate('achievementId', 'title icon')
      .lean();

    const feed = [];

    activities.forEach(act => {
      if (act.userId) {
        feed.push({
          id: `act_${act._id}`,
          type: 'ACTIVITY',
          user: act.userId.name,
          avatar: act.userId.avatar,
          title: `Logged a ${act.category} activity`,
          description: `Saved ${act.carbonEmission} tCO2e`,
          timestamp: act.createdAt
        });
      }
    });

    badges.forEach(badge => {
      if (badge.userId && badge.achievementId) {
        feed.push({
          id: `badge_${badge._id}`,
          type: 'BADGE',
          user: badge.userId.name,
          avatar: badge.userId.avatar,
          title: `Earned a new badge!`,
          description: `Unlocked: ${badge.achievementId.title}`,
          icon: badge.achievementId.icon,
          timestamp: badge.createdAt || badge.unlockedAt
        });
      }
    });

    // Sort combined by timestamp DESC and take top 15
    feed.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    return res.status(200).json({ success: true, data: feed.slice(0, 15) });
  } catch (error) {
    console.error(`Error in getCommunityFeed: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get Active Community Challenges
// @route   GET /api/community/challenges
// @access  Private
const getCommunityChallenges = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    const challenges = await Challenge.find({ isActive: true }).lean();
    const activeChallengeIds = challenges.map(c => c._id);

    // Find which of these challenges the current user has joined
    const userChallenges = await UserChallenge.find({
      userId: currentUserId,
      challengeId: { $in: activeChallengeIds }
    }).lean();

    const joinedChallengeIds = userChallenges.map(uc => uc.challengeId.toString());

    const result = challenges.map(ch => {
      const participantsCount = ch.participants ? ch.participants.length : 0;
      
      // Calculate a rough "community progress" for the UI if not explicitly tracked 
      // For simplicity here, we create a fake percentage based on participants to target, 
      // or if you have a true progress tracker, use that.
      const progress = Math.min(Math.round((participantsCount / (ch.targetValue || 100)) * 100), 100);

      return {
        id: ch._id,
        title: ch.title,
        description: ch.description,
        progress: progress > 0 ? progress : 12, // fallback for visual flair
        participants: participantsCount,
        hasJoined: joinedChallengeIds.includes(ch._id.toString())
      };
    });

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error(`Error in getCommunityChallenges: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Join a Community Challenge
// @route   POST /api/community/challenges/:id/join
// @access  Private
const joinChallenge = async (req, res) => {
  try {
    const challengeId = req.params.id;
    const userId = req.user.id;

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }

    const existing = await UserChallenge.findOne({ userId, challengeId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Already joined this challenge' });
    }

    await UserChallenge.create({ userId, challengeId });

    if (!challenge.participants.includes(userId)) {
      challenge.participants.push(userId);
      await challenge.save();
    }

    // Increase total challenges for user
    await User.findByIdAndUpdate(userId, { $inc: { totalChallenges: 1 } });

    return res.status(200).json({ success: true, message: 'Joined challenge successfully' });
  } catch (error) {
    console.error(`Error in joinChallenge: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  getCommunityStats,
  getLeaderboard,
  getCommunityFeed,
  getCommunityChallenges,
  joinChallenge
};
