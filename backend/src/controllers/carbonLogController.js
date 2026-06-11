const mongoose = require('mongoose');
const CarbonLog = require('../models/CarbonLog');

// @desc    Create new carbon log
// @route   POST /api/carbonlogs
// @access  Private
const createCarbonLog = async (req, res) => {
  try {
    const { activityId, carbonEmission, category, month, year } = req.body;

    if (!activityId || carbonEmission === undefined || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide activityId, carbonEmission, and category'
      });
    }

    const carbonLog = new CarbonLog({
      userId: req.user.id,
      activityId,
      carbonEmission,
      category,
      month,
      year
    });

    await carbonLog.save();

    res.status(201).json({
      success: true,
      data: carbonLog
    });
  } catch (error) {
    console.error(`Error in createCarbonLog: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get user's carbon logs
// @route   GET /api/carbonlogs
// @access  Private
const getCarbonLogs = async (req, res) => {
  try {
    const carbonLogs = await CarbonLog.find({ userId: req.user.id }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: carbonLogs.length,
      data: carbonLogs
    });
  } catch (error) {
    console.error(`Error in getCarbonLogs: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get carbon summary
// @route   GET /api/carbonlogs/summary
// @access  Private
const getCarbonSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    // Aggregate totalCarbon, totalActivities, and categoryBreakdown
    const summary = await CarbonLog.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: "$category",
          totalEmission: { $sum: "$carbonEmission" },
          count: { $sum: 1 }
        }
      }
    ]);

    let totalCarbon = 0;
    let totalActivities = 0;
    const categoryBreakdown = {};

    summary.forEach(item => {
      totalCarbon += item.totalEmission;
      totalActivities += item.count;
      categoryBreakdown[item._id] = item.totalEmission;
    });

    res.status(200).json({
      success: true,
      data: {
        totalCarbon,
        totalActivities,
        categoryBreakdown
      }
    });
  } catch (error) {
    console.error(`Error in getCarbonSummary: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  createCarbonLog,
  getCarbonLogs,
  getCarbonSummary
};
