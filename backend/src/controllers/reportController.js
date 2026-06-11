const Activity = require('../models/Activity');
const CarbonLog = require('../models/CarbonLog');
const Report = require('../models/Report');
const mongoose = require('mongoose');
const { createNotification } = require('./notificationController');

// Internal helper to calculate metrics and generate report
const generateReportLogic = async (userId, reportType, startDate, endDate) => {
  const objectIdUser = new mongoose.Types.ObjectId(userId);
  
  // Base match condition for carbon logs
  const matchCondition = { userId: objectIdUser };
  if (startDate || endDate) {
    matchCondition.createdAt = {};
    if (startDate) matchCondition.createdAt.$gte = startDate;
    if (endDate) matchCondition.createdAt.$lte = endDate;
  }
  
  // Base match condition for activities
  const activityMatch = { userId: objectIdUser };
  if (startDate || endDate) {
    activityMatch.date = {};
    if (startDate) activityMatch.date.$gte = startDate;
    if (endDate) activityMatch.date.$lte = endDate;
  }

  // 1. Calculate Total Activities
  const totalActivities = await Activity.countDocuments(activityMatch);

  // 2. Calculate Total Carbon Emission
  const carbonAgg = await CarbonLog.aggregate([
    { $match: matchCondition },
    { $group: { _id: null, total: { $sum: '$carbonEmission' } } }
  ]);
  const totalCarbon = carbonAgg.length > 0 ? carbonAgg[0].total : 0;

  // 3. Calculate Sustainability Score
  let sustainabilityScore = 50;
  if (totalActivities > 0) {
    const avgCarbon = totalCarbon / totalActivities;
    // Lower average carbon = higher score. More activities = higher score
    sustainabilityScore = Math.max(0, Math.min(100, 100 - (avgCarbon / 10) + (totalActivities * 2)));
    sustainabilityScore = Math.round(sustainabilityScore);
  } else {
    sustainabilityScore = 0;
  }

  // 4. Generate Recommendations
  const recommendations = [];
  if (sustainabilityScore < 50) {
    recommendations.push("Consider taking public transport to lower your carbon footprint.");
    recommendations.push("Join a new sustainability challenge to boost your score.");
  } else {
    recommendations.push("Great job keeping your carbon footprint low!");
    recommendations.push("Share your achievements with friends to inspire them.");
    recommendations.push("Consider offsetting your remaining emissions.");
  }

  // Set titles based on type
  let title = "Summary Report";
  let description = "Overall sustainability summary";
  if (reportType === 'monthly') {
    title = "Monthly Report";
    description = "Your sustainability progress for the month";
  } else if (reportType === 'weekly') {
    title = "Weekly Report";
    description = "Your sustainability progress for the week";
  }

  // 5. Store generated report
  const report = await Report.create({
    userId,
    reportType,
    title,
    description,
    totalActivities,
    totalCarbon,
    sustainabilityScore,
    recommendations
  });

  // Trigger Notification
  await createNotification(
    userId,
    "New Report Generated",
    `Your ${reportType} report is ready. Sustainability Score: ${sustainabilityScore}.`,
    'report'
  );

  return report;
};

// @desc    Generate Monthly Report
// @route   POST /api/reports/generate/monthly
// @access  Private
const generateMonthlyReport = async (req, res) => {
  try {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const report = await generateReportLogic(req.user.id, 'monthly', startDate, endDate);

    return res.status(201).json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error(`Error in generateMonthlyReport: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Generate Weekly Report
// @route   POST /api/reports/generate/weekly
// @access  Private
const generateWeeklyReport = async (req, res) => {
  try {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Start of week (Monday)
    
    const startDate = new Date(now.setDate(diff));
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);

    const report = await generateReportLogic(req.user.id, 'weekly', startDate, endDate);

    return res.status(201).json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error(`Error in generateWeeklyReport: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Generate Summary Report
// @route   POST /api/reports/generate/summary
// @access  Private
const generateSummaryReport = async (req, res) => {
  try {
    // No date constraints for overall summary
    const report = await generateReportLogic(req.user.id, 'summary', null, null);

    return res.status(201).json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error(`Error in generateSummaryReport: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get user's reports
// @route   GET /api/reports
// @access  Private
const getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.user.id })
      .populate('userId', 'name email avatar')
      .sort({ generatedAt: -1 });

    return res.status(200).json({
      success: true,
      count: reports.length,
      data: reports
    });
  } catch (error) {
    console.error(`Error in getMyReports: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get report by id
// @route   GET /api/reports/:id
// @access  Private
const getReportById = async (req, res) => {
  try {
    const report = await Report.findOne({ _id: req.params.id, userId: req.user.id })
      .populate('userId', 'name email avatar');

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    return res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error(`Error in getReportById: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  generateMonthlyReport,
  generateWeeklyReport,
  generateSummaryReport,
  getMyReports,
  getReportById
};
