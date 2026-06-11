const Recommendation = require('../models/Recommendation');
const Activity = require('../models/Activity');
const CarbonLog = require('../models/CarbonLog');
const UserChallenge = require('../models/UserChallenge');
const mongoose = require('mongoose');
const { createNotification } = require('./notificationController');

// @desc    Generate new recommendations based on user data
// @route   POST /api/recommendations/generate
// @access  Private
const generateRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const objectIdUser = new mongoose.Types.ObjectId(userId);

    // Get basic stats for rules
    const totalActivities = await Activity.countDocuments({ userId: objectIdUser });
    
    const carbonAgg = await CarbonLog.aggregate([
      { $match: { userId: objectIdUser } },
      { $group: { _id: null, total: { $sum: '$carbonEmission' } } }
    ]);
    const totalCarbon = carbonAgg.length > 0 ? carbonAgg[0].total : 0;

    const challengesJoined = await UserChallenge.countDocuments({ userId: objectIdUser });

    // Potential recommendations map
    const possibleRecommendations = [];

    // Dashboard Analytics & Logs (Transportation / General)
    let avgCarbon = totalActivities > 0 ? totalCarbon / totalActivities : 0;
    
    if (avgCarbon > 20 || totalActivities === 0) {
      possibleRecommendations.push({
        title: "Use public transport",
        description: "Your average emissions indicate high usage of personal vehicles. Switching to buses or trains can significantly lower your footprint.",
        category: "Transportation",
        priority: "high",
        estimatedCarbonSaving: 15
      });
    }

    if (avgCarbon > 10 || totalActivities === 0) {
      possibleRecommendations.push({
        title: "Use bicycle instead of car",
        description: "Consider biking for short trips to reduce your transportation emissions to zero.",
        category: "Transportation",
        priority: "medium",
        estimatedCarbonSaving: 5
      });
    }

    // Energy 
    possibleRecommendations.push({
      title: "Reduce electricity usage",
      description: "Unplug idle electronics and turn off lights when not in use.",
      category: "Energy",
      priority: "medium",
      estimatedCarbonSaving: 8
    });
    
    possibleRecommendations.push({
      title: "Switch to LED bulbs",
      description: "Replace incandescent bulbs with LEDs to save energy.",
      category: "Energy",
      priority: "low",
      estimatedCarbonSaving: 2
    });

    // Community (Challenges logic)
    if (challengesJoined === 0) {
      possibleRecommendations.push({
        title: "Join sustainability challenges",
        description: "Participate in challenges to stay motivated and track your eco-friendly goals.",
        category: "Community",
        priority: "high",
        estimatedCarbonSaving: 0
      });
    }

    possibleRecommendations.push({
      title: "Plant trees",
      description: "Join local tree planting events or use tree-planting search engines.",
      category: "Community",
      priority: "medium",
      estimatedCarbonSaving: 20
    });

    // Lifestyle
    possibleRecommendations.push({
      title: "Reduce plastic usage",
      description: "Switch to reusable bags, bottles, and containers.",
      category: "Lifestyle",
      priority: "medium",
      estimatedCarbonSaving: 5
    });

    possibleRecommendations.push({
      title: "Improve recycling habits",
      description: "Sort your waste and ensure recyclables are clean.",
      category: "Lifestyle",
      priority: "low",
      estimatedCarbonSaving: 3
    });

    // Determine which to insert (avoid duplicates using title matching for this user)
    const existingRecs = await Recommendation.find({ userId: objectIdUser });
    const existingTitles = existingRecs.map(r => r.title);

    let insertedCount = 0;
    for (const rec of possibleRecommendations) {
      if (!existingTitles.includes(rec.title)) {
        await Recommendation.create({
          userId: objectIdUser,
          title: rec.title,
          description: rec.description,
          category: rec.category,
          priority: rec.priority,
          estimatedCarbonSaving: rec.estimatedCarbonSaving
        });
        insertedCount++;
      }
    }

    // Trigger Notification if new recommendations were created
    if (insertedCount > 0) {
      await createNotification(
        userId,
        "New Recommendations",
        `We have generated ${insertedCount} new personalized recommendations for you.`,
        'recommendation'
      );
    }

    return res.status(201).json({
      success: true,
      message: `${insertedCount} new recommendations generated.`
    });

  } catch (error) {
    console.error(`Error in generateRecommendations: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get user recommendations
// @route   GET /api/recommendations
// @access  Private
const getMyRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const recommendations = await Recommendation.find({ userId });

    // Custom sorting: High -> Medium -> Low, then by generatedAt (newest first)
    const priorityWeight = { high: 3, medium: 2, low: 1 };
    recommendations.sort((a, b) => {
      const weightDiff = priorityWeight[b.priority] - priorityWeight[a.priority];
      if (weightDiff !== 0) return weightDiff;
      return new Date(b.generatedAt) - new Date(a.generatedAt);
    });

    return res.status(200).json({
      success: true,
      count: recommendations.length,
      data: recommendations
    });
  } catch (error) {
    console.error(`Error in getMyRecommendations: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get recommendation by ID
// @route   GET /api/recommendations/:id
// @access  Private
const getRecommendationById = async (req, res) => {
  try {
    const rec = await Recommendation.findOne({ _id: req.params.id, userId: req.user.id });
    if (!rec) {
      return res.status(404).json({ success: false, message: 'Recommendation not found' });
    }
    return res.status(200).json({
      success: true,
      data: rec
    });
  } catch (error) {
    console.error(`Error in getRecommendationById: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Mark recommendation as read
// @route   PATCH /api/recommendations/read/:id
// @access  Private
const markAsRead = async (req, res) => {
  try {
    const rec = await Recommendation.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { isRead: true },
      { new: true }
    );

    if (!rec) {
      return res.status(404).json({ success: false, message: 'Recommendation not found' });
    }

    return res.status(200).json({
      success: true,
      data: rec
    });
  } catch (error) {
    console.error(`Error in markAsRead: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  generateRecommendations,
  getMyRecommendations,
  getRecommendationById,
  markAsRead
};
