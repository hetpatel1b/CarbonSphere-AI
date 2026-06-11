const mongoose = require('mongoose');
const Report = require('../models/Report');
const Activity = require('../models/Activity');
const OffsetPurchase = require('../models/OffsetPurchase');
const UserChallenge = require('../models/UserChallenge');
const UserAchievement = require('../models/UserAchievement');
const groqService = require('../services/groqService');

// @desc    Generate a new sustainability report
// @route   POST /api/reports/generate
// @access  Private
const generateReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const { reportType } = req.body; // 'monthly', 'annual', 'comprehensive'
    const objectIdUser = new mongoose.Types.ObjectId(userId);

    // Filter by dates if needed (for simplicity, we grab all-time for comprehensive, but we can filter)
    let dateFilter = {};
    const now = new Date();
    if (reportType === 'monthly') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      dateFilter = { $gte: startOfMonth };
    } else if (reportType === 'annual') {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      dateFilter = { $gte: startOfYear };
    }

    const activityMatch = { userId: objectIdUser };
    if (dateFilter.$gte) activityMatch.date = dateFilter;

    // 1. Aggregating Activities (Emissions Analysis)
    const emissionsAgg = await Activity.aggregate([
      { $match: activityMatch },
      { $group: { _id: '$category', total: { $sum: '$carbonEmission' }, count: { $sum: 1 } } },
      { $sort: { total: -1 } }
    ]);
    
    let totalEmissions = 0;
    const categoryBreakdown = emissionsAgg.map(item => {
      totalEmissions += item.total;
      return { category: item._id, amount: item.total, activitiesCount: item.count };
    });

    // 2. Aggregating Offsets
    const offsetMatch = { userId: objectIdUser };
    if (dateFilter.$gte) offsetMatch.createdAt = dateFilter;

    const offsetAgg = await OffsetPurchase.aggregate([
      { $match: offsetMatch },
      { $group: { _id: null, totalCredits: { $sum: '$credits' }, totalCost: { $sum: '$cost' }, count: { $sum: 1 } } }
    ]);

    const offsetContributions = offsetAgg.length > 0 ? {
      totalCredits: offsetAgg[0].totalCredits,
      totalCost: offsetAgg[0].totalCost,
      projectsSupported: offsetAgg[0].count,
      treesEquivalent: Math.round(offsetAgg[0].totalCredits * 50)
    } : { totalCredits: 0, totalCost: 0, projectsSupported: 0, treesEquivalent: 0 };

    // 3. Community Participation
    const challengeMatch = { userId: objectIdUser };
    if (dateFilter.$gte) challengeMatch.joinedAt = dateFilter;
    const challengesJoined = await UserChallenge.countDocuments(challengeMatch);
    const challengesCompleted = await UserChallenge.countDocuments({ ...challengeMatch, status: 'completed' });

    // 4. Achievements
    const achievementMatch = { userId: objectIdUser };
    if (dateFilter.$gte) achievementMatch.earnedAt = dateFilter;
    const achievementsEarned = await UserAchievement.countDocuments(achievementMatch);

    // 5. Net Impact & Sustainability Score
    const netCarbonImpact = Math.max(0, totalEmissions - offsetContributions.totalCredits);
    let sustainabilityScore = 50; // Base score
    if (totalEmissions > 0) {
      const offsetRatio = Math.min(1, offsetContributions.totalCredits / totalEmissions);
      sustainabilityScore = Math.round(50 + (offsetRatio * 30) + Math.min(20, (achievementsEarned * 2) + (challengesCompleted * 2)));
    } else if (totalEmissions === 0 && offsetContributions.totalCredits > 0) {
      sustainabilityScore = 100;
    } else {
      sustainabilityScore = 0; // No data
    }

    // 6. Generate AI Insights
    let aiInsights = {
      executiveSummary: "You have just started your sustainability journey. Keep logging activities!",
      keyFindings: ["Low activity logging."],
      riskAssessment: "Not enough data to calculate risk.",
      improvementOpportunities: ["Start logging daily transit."]
    };

    if (totalEmissions > 0 || offsetContributions.totalCredits > 0) {
      const prompt = `
        Act as an expert ESG analyst. Write a concise sustainability report.
        Data: 
        - Total Emissions: ${totalEmissions.toFixed(2)} tCO2e
        - Top categories: ${categoryBreakdown.map(c => `${c.category} (${c.amount.toFixed(2)})`).join(', ')}
        - Offsets: ${offsetContributions.totalCredits} tCO2e
        - Challenges Completed: ${challengesCompleted}
        
        Return exactly this JSON format with no markdown wrappers:
        {
          "executiveSummary": "1 paragraph summary",
          "keyFindings": ["Point 1", "Point 2", "Point 3"],
          "riskAssessment": "1 paragraph identifying highest emission risks",
          "improvementOpportunities": ["Action 1", "Action 2", "Action 3"]
        }
      `;

      try {
        const aiResponse = await groqService.generateAssistantResponse(prompt);
        const parsed = typeof aiResponse === 'string' ? JSON.parse(aiResponse) : aiResponse;
        aiInsights = {
          executiveSummary: parsed.executiveSummary || aiInsights.executiveSummary,
          keyFindings: parsed.keyFindings || aiInsights.keyFindings,
          riskAssessment: parsed.riskAssessment || aiInsights.riskAssessment,
          improvementOpportunities: parsed.improvementOpportunities || aiInsights.improvementOpportunities
        };
      } catch (err) {
        console.warn("AI Insight generation failed, using defaults:", err.message);
      }
    }

    // 7. Assemble Report Data
    const reportData = {
      summary: {
        totalEmissions,
        netCarbonImpact,
        sustainabilityScore,
        period: reportType,
        generatedDate: new Date().toISOString()
      },
      emissionsAnalysis: {
        categoryBreakdown,
        totalActivities: categoryBreakdown.reduce((acc, curr) => acc + curr.activitiesCount, 0)
      },
      offsetContributions,
      community: {
        challengesJoined,
        challengesCompleted,
        achievementsEarned
      },
      aiInsights
    };

    // 8. Save to MongoDB
    const report = await Report.create({
      userId,
      reportType,
      reportData
    });

    return res.status(201).json({ success: true, data: report });
  } catch (error) {
    console.error(`Error generating report: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get user's generated reports
// @route   GET /api/reports
// @access  Private
const getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.user.id })
      .sort({ generatedAt: -1 })
      .select('-reportData'); // Omit heavy payload for list view

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

// @desc    Get specific report by ID
// @route   GET /api/reports/:id
// @access  Private
const getReportById = async (req, res) => {
  try {
    const report = await Report.findOne({ _id: req.params.id, userId: req.user.id });
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }
    return res.status(200).json({ success: true, data: report });
  } catch (error) {
    console.error(`Error in getReportById: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Delete a report
// @route   DELETE /api/reports/:id
// @access  Private
const deleteReport = async (req, res) => {
  try {
    const report = await Report.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }
    return res.status(200).json({ success: true, message: 'Report deleted successfully' });
  } catch (error) {
    console.error(`Error in deleteReport: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  generateReport,
  getMyReports,
  getReportById,
  deleteReport
};
