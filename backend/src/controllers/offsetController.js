const mongoose = require('mongoose');
const OffsetProject = require('../models/OffsetProject');
const OffsetPurchase = require('../models/OffsetPurchase');
const Activity = require('../models/Activity');
const aiService = require('../services/aiService');

// @desc    Get all available offset projects
// @route   GET /api/offsets/projects
// @access  Private
const getProjects = async (req, res) => {
  try {
    const projects = await OffsetProject.find({ availableCredits: { $gt: 0 } }).sort({ rating: -1 });
    return res.status(200).json({ success: true, data: projects });
  } catch (error) {
    console.error(`Error in getProjects: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get AI project recommendations based on user footprint
// @route   GET /api/offsets/recommendations
// @access  Private
const getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const objectIdUser = new mongoose.Types.ObjectId(userId);

    const categoryAgg = await Activity.aggregate([
      { $match: { userId: objectIdUser } },
      { $group: { _id: '$category', total: { $sum: '$carbonEmission' } } },
      { $sort: { total: -1 } },
      { $limit: 1 }
    ]);

    let topCategory = "General";
    if (categoryAgg.length > 0) {
      topCategory = categoryAgg[0]._id;
    }

    const prompt = `
      Act as an AI sustainability advisor. 
      The user's highest emitting category is ${topCategory}.
      Suggest a carbon offset category to support and explain why in 1 sentence. 
      Categories available: Reforestation, Renewable Energy, Ocean Cleanup, Water Conservation, Sustainable Agriculture.
      Return JSON: { "suggestedCategory": "exact category name", "reason": "brief reason", "impactScore": 95, "expectedReduction": "estimated tCO2" }
      Do not include markdown tags.
    `;

    let aiData;
    try {
      const aiResponse = await aiService.generateAssistantResponse(prompt);
      aiData = typeof aiResponse === 'string' ? JSON.parse(aiResponse) : aiResponse;
    } catch (err) {
      console.warn("AI parsing failed, using fallback", err.message);
      aiData = {
        suggestedCategory: "Reforestation",
        reason: "Reforestation directly sequesters carbon to counteract your emissions.",
        impactScore: 90,
        expectedReduction: "Variable"
      };
    }

    // Map the category to actual projects
    const recommendedProjects = await OffsetProject.find({ 
      category: aiData.suggestedCategory,
      availableCredits: { $gt: 0 }
    }).limit(2);

    return res.status(200).json({ 
      success: true, 
      data: {
        insight: aiData,
        projects: recommendedProjects
      }
    });

  } catch (error) {
    console.error(`Error in getRecommendations: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Purchase an offset
// @route   POST /api/offsets/purchase
// @access  Private
const purchaseOffset = async (req, res) => {
  try {
    const { projectId, credits } = req.body;
    const userId = req.user.id;

    if (!projectId || !credits || credits <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid purchase data' });
    }

    const project = await OffsetProject.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (project.availableCredits < credits) {
      return res.status(400).json({ success: false, message: 'Not enough available credits' });
    }

    const cost = project.costPerTon * credits;

    const purchase = await OffsetPurchase.create({
      userId,
      projectId,
      credits,
      cost
    });

    project.availableCredits -= credits;
    await project.save();

    return res.status(200).json({ success: true, data: purchase, message: 'Offset purchased successfully!' });
  } catch (error) {
    console.error(`Error in purchaseOffset: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get user offset history
// @route   GET /api/offsets/history
// @access  Private
const getHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const total = await OffsetPurchase.countDocuments({ userId });
    
    const purchases = await OffsetPurchase.find({ userId })
      .populate('projectId')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    return res.status(200).json({
      success: true,
      count: purchases.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      data: purchases
    });
  } catch (error) {
    console.error(`Error in getHistory: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get offset statistics
// @route   GET /api/offsets/stats
// @access  Private
const getStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const objectIdUser = new mongoose.Types.ObjectId(userId);

    const statsAgg = await OffsetPurchase.aggregate([
      { $match: { userId: objectIdUser } },
      { $group: {
          _id: null,
          totalCredits: { $sum: '$credits' },
          totalCost: { $sum: '$cost' },
          totalPurchases: { $sum: 1 },
          uniqueProjects: { $addToSet: '$projectId' }
      }}
    ]);

    const emissionsAgg = await Activity.aggregate([
      { $match: { userId: objectIdUser } },
      { $group: { _id: null, totalEmissions: { $sum: '$carbonEmission' } } }
    ]);

    let stats = {
      totalCredits: 0,
      totalCost: 0,
      totalPurchases: 0,
      uniqueProjectsCount: 0,
      treesEquivalent: 0,
      totalEmissions: 0,
      offsetPercentage: 0
    };

    if (statsAgg.length > 0) {
      const s = statsAgg[0];
      stats.totalCredits = s.totalCredits;
      stats.totalCost = s.totalCost;
      stats.totalPurchases = s.totalPurchases;
      stats.uniqueProjectsCount = s.uniqueProjects.length;
      stats.treesEquivalent = Math.round(s.totalCredits * 50); // Rough industry metric
    }

    if (emissionsAgg.length > 0) {
      stats.totalEmissions = emissionsAgg[0].totalEmissions;
    }

    if (stats.totalEmissions > 0) {
      stats.offsetPercentage = Math.min(Math.round((stats.totalCredits / stats.totalEmissions) * 100), 100);
    }

    return res.status(200).json({ success: true, data: stats });
  } catch (error) {
    console.error(`Error in getStats: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  getProjects,
  getRecommendations,
  purchaseOffset,
  getHistory,
  getStats
};
