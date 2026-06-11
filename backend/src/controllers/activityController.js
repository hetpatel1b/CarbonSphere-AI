const Activity = require('../models/Activity');

// @desc    Create new activity
// @route   POST /api/activities
// @access  Private
const createActivity = async (req, res) => {
  try {
    const { activityType, description, carbonEmission, category, date, title, notes } = req.body;

    if (!activityType || carbonEmission === undefined || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide activityType, carbonEmission, and category'
      });
    }

    const activity = new Activity({
      userId: req.user.id,
      activityType,
      description,
      carbonEmission,
      category,
      date,
      title,
      notes
    });

    await activity.save();

    // Trigger dynamic achievement engine synchronously so we can return newly unlocked
    const { checkAndUnlockAchievements } = require('../services/achievementEngine');
    const newlyUnlockedAchievements = await checkAndUnlockAchievements(req.user.id);

    // Trigger dynamic challenge engine synchronously
    const { checkAndUpdateChallenges } = require('../services/challengeEngine');
    const newlyCompletedChallenges = await checkAndUpdateChallenges(req.user.id);

    res.status(201).json({
      success: true,
      data: activity,
      newlyUnlocked: newlyUnlockedAchievements || [],
      newlyCompletedChallenges: newlyCompletedChallenges || []
    });
  } catch (error) {
    console.error(`Error in createActivity: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get user activities
// @route   GET /api/activities
// @access  Private
const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ userId: req.user.id }).sort({ date: -1 });
    res.status(200).json({
      success: true,
      count: activities.length,
      data: activities
    });
  } catch (error) {
    console.error(`Error in getActivities: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get single activity
// @route   GET /api/activities/:id
// @access  Private
const getActivityById = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }

    // Make sure user owns activity
    if (activity.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to access this activity' });
    }

    res.status(200).json({
      success: true,
      data: activity
    });
  } catch (error) {
    console.error(`Error in getActivityById: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Update activity
// @route   PUT /api/activities/:id
// @access  Private
const updateActivity = async (req, res) => {
  try {
    let activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }

    // Make sure user owns activity
    if (activity.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to update this activity' });
    }

    activity = await Activity.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: activity
    });
  } catch (error) {
    console.error(`Error in updateActivity: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Delete activity
// @route   DELETE /api/activities/:id
// @access  Private
const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }

    // Make sure user owns activity
    if (activity.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this activity' });
    }

    await activity.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error(`Error in deleteActivity: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  createActivity,
  getActivities,
  getActivityById,
  updateActivity,
  deleteActivity
};
