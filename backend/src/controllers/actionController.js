const UserAction = require('../models/UserAction');
const User = require('../models/User');
const Achievement = require('../models/Achievement');
const UserAchievement = require('../models/UserAchievement');
const Activity = require('../models/Activity'); // for feed if needed
const { createNotification } = require('./notificationController');

// Helper to seed and unlock achievements
const checkActionAchievements = async (userId, count) => {
  const milestones = [
    { count: 1, title: 'Action Taker', desc: 'Applied your first sustainability action.' },
    { count: 3, title: 'Carbon Warrior', desc: 'Applied 3 sustainability actions.' },
    { count: 5, title: 'Climate Champion', desc: 'Applied 5 sustainability actions.' }
  ];

  for (const m of milestones) {
    if (count === m.count) {
      let achievement = await Achievement.findOne({ title: m.title });
      if (!achievement) {
        achievement = await Achievement.create({
          title: m.title,
          description: m.desc,
          badgeIcon: 'action-badge.png',
          points: m.count * 10,
          category: 'Actions',
          criteria: { type: 'action_count', target: m.count }
        });
      }

      const existing = await UserAchievement.findOne({ userId, achievementId: achievement._id });
      if (!existing) {
        await UserAchievement.create({ userId, achievementId: achievement._id });
        await User.findByIdAndUpdate(userId, { $inc: { totalAchievements: 1 } });
        await createNotification(userId, "Achievement Unlocked!", `You unlocked the '${achievement.title}' badge!`, "achievement");
      }
    }
  }
};

// @desc    Apply a new sustainability action
// @route   POST /api/actions/apply
// @access  Private
const applyAction = async (req, res) => {
  try {
    const { title, reduction, difficulty, impact } = req.body;
    const userId = req.user.id;

    if (!title || reduction === undefined) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Check if already active
    const existing = await UserAction.findOne({ userId, actionTitle: title, status: 'active' });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Action already applied and active.' });
    }

    const newAction = await UserAction.create({
      userId,
      actionTitle: title,
      reduction,
      difficulty: difficulty || 'Medium',
      impact: impact || 'Medium',
      status: 'active'
    });

    const activeCount = await UserAction.countDocuments({ userId, status: 'active' });
    await checkActionAchievements(userId, activeCount);

    // Create a community activity log
    const user = await User.findById(userId);
    if (user) {
      // Simulate community feed entry by creating a pseudo-activity
      await Activity.create({
        userId,
        category: 'Action Plan',
        activityType: 'Committed to Action',
        duration: 0,
        carbonEmission: 0,
        distance: 0,
        energyUsed: 0,
        description: `Committed to ${title}`
      });
    }

    return res.status(201).json({ success: true, data: newAction });
  } catch (error) {
    console.error(`Error in applyAction: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get active actions
// @route   GET /api/actions/active
// @access  Private
const getActiveActions = async (req, res) => {
  try {
    const userId = req.user.id;
    const actions = await UserAction.find({ userId, status: 'active' }).sort({ appliedAt: -1 });

    return res.status(200).json({ success: true, count: actions.length, data: actions });
  } catch (error) {
    console.error(`Error in getActiveActions: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  applyAction,
  getActiveActions
};
