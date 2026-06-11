const Recommendation = require('../models/Recommendation');
const Activity = require('../models/Activity');
const CarbonLog = require('../models/CarbonLog');
const UserChallenge = require('../models/UserChallenge');
const UserAchievement = require('../models/UserAchievement');
const User = require('../models/User');
const mongoose = require('mongoose');
const { createNotification } = require('./notificationController');
const { GoogleGenerativeAI } = require('@google/generative-ai');

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

// @desc    Analyze user profile with Gemini AI and generate insights
// @route   POST /api/ai-coach/analyze
// @access  Private
const analyzeWithAI = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Check for API key
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ success: false, message: 'Gemini API Key is not configured on the server.' });
    }

    // Gather data
    const objectIdUser = new mongoose.Types.ObjectId(userId);
    const activities = await Activity.find({ userId: objectIdUser }).sort({ date: -1 }).limit(20);
    
    if (activities.length === 0) {
      return res.status(400).json({ success: false, message: 'Not enough activity data to analyze.' });
    }

    const challenges = await UserChallenge.find({ userId: objectIdUser }).populate('challengeId');
    const achievements = await UserAchievement.find({ userId: objectIdUser }).populate('achievementId');

    const totalCarbonAgg = await CarbonLog.aggregate([
      { $match: { userId: objectIdUser } },
      { $group: { _id: null, total: { $sum: '$carbonEmission' } } }
    ]);
    const totalCarbon = totalCarbonAgg.length > 0 ? totalCarbonAgg[0].total : 0;

    const categoryBreakdownAgg = await Activity.aggregate([
      { $match: { userId: objectIdUser } },
      { $group: { _id: '$category', totalCarbon: { $sum: '$carbonEmission' } } }
    ]);

    // Build the Prompt
    const prompt = `
      You are CarbonSphere's AI Sustainability Coach. Analyze the following user data and provide personalized recommendations to help them reduce their carbon footprint.
      
      User Data:
      Total Carbon Emitted: ${totalCarbon} kg CO2e
      Total Activities Logged: ${activities.length}
      
      Category Breakdown:
      ${categoryBreakdownAgg.map(c => `- ${c._id}: ${c.totalCarbon} kg CO2e`).join('\n')}
      
      Recent Activities:
      ${activities.slice(0, 10).map(a => `- ${a.category} (${a.activityType}): ${a.carbonEmission} kg CO2e`).join('\n')}
      
      Challenges Status:
      ${challenges.map(c => `- ${c.challengeId ? c.challengeId.title : 'Unknown'}: ${c.completed ? 'Completed' : 'In Progress'}`).join('\n')}
      
      Achievements Earned:
      ${achievements.map(a => `- ${a.achievementId ? a.achievementId.title : 'Unknown'}`).join('\n')}
      
      Based on this data, provide a JSON response EXACTLY matching this structure:
      {
        "score": <number between 0-100 indicating their overall sustainability score>,
        "strengths": [<string array of up to 3 positive habits based on data>],
        "weaknesses": [<string array of up to 3 areas needing improvement>],
        "monthlyGoal": "<string, a specific measurable goal for the month>",
        "carbonReductionPotential": "<string, e.g., '0.15 tCO2e/mo'>",
        "challengeSuggestion": "<string, name of a challenge they should try or focus on>",
        "recommendations": [
          {
            "title": "<string, short actionable title>",
            "description": "<string, detailed explanation of why and how>",
            "category": "<string, e.g., Transport, Energy, Lifestyle>",
            "saving": "<string, estimated saving e.g., '5 kg CO2e'>",
            "confidence": <number between 1-100>
          }
        ]
      }
      Do NOT include any markdown formatting or \`\`\`json wrappers in your response. Output raw JSON only.
    `;

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent(prompt);
    let aiResponseText = result.response.text().trim();
    
    // Clean up if it returned markdown
    if (aiResponseText.startsWith('```json')) {
      aiResponseText = aiResponseText.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (aiResponseText.startsWith('```')) {
      aiResponseText = aiResponseText.replace(/^```/, '').replace(/```$/, '').trim();
    }

    let aiData;
    try {
      aiData = JSON.parse(aiResponseText);
    } catch (err) {
      console.error("Failed to parse Gemini response:", aiResponseText);
      return res.status(500).json({ success: false, message: 'Failed to process AI response.' });
    }

    // Overwrite Recommendations in DB
    await Recommendation.deleteMany({ userId: objectIdUser });
    
    const recDocs = [];
    if (aiData.recommendations && Array.isArray(aiData.recommendations)) {
      for (const rec of aiData.recommendations) {
        recDocs.push({
          userId: objectIdUser,
          title: rec.title,
          description: rec.description,
          category: rec.category,
          priority: 'high',
          estimatedCarbonSaving: parseFloat(rec.saving) || 0
        });
      }
      if (recDocs.length > 0) {
        await Recommendation.insertMany(recDocs);
      }
    }

    // Cache the AI Insight on the User model
    const userToUpdate = await User.findById(userId);
    userToUpdate.aiInsight = {
      score: aiData.score || 0,
      strengths: aiData.strengths || [],
      weaknesses: aiData.weaknesses || [],
      monthlyGoal: aiData.monthlyGoal || "",
      carbonReductionPotential: aiData.carbonReductionPotential || "",
      challengeSuggestion: aiData.challengeSuggestion || "",
      generatedAt: new Date()
    };
    await userToUpdate.save();

    return res.status(200).json({
      success: true,
      data: {
        insight: userToUpdate.aiInsight,
        recommendations: aiData.recommendations
      }
    });
  } catch (error) {
    console.error(`Error in analyzeWithAI: ${error.message}`);
    return res.status(500).json({ success: false, message: error.message || 'Server Error' });
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
  markAsRead,
  analyzeWithAI
};
