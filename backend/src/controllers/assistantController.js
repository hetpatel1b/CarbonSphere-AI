const User = require('../models/User');
const Activity = require('../models/Activity');
const Forecast = require('../models/Forecast');
const UserChallenge = require('../models/UserChallenge');
const UserAchievement = require('../models/UserAchievement');
const Simulation = require('../models/Simulation');
const groqService = require('../services/groqService');
const mongoose = require('mongoose');

// @desc    Chat with AI Assistant
// @route   POST /api/assistant/chat
// @access  Private
const chatWithAssistant = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.id;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ success: false, message: 'AI configuration is missing on the server' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const objectIdUser = new mongoose.Types.ObjectId(userId);

    // 1. Gather Activity Data
    const categoryAgg = await Activity.aggregate([
      { $match: { userId: objectIdUser } },
      { $group: { _id: '$category', total: { $sum: '$carbonEmission' } } },
      { $sort: { total: -1 } }
    ]);
    const topCategory = categoryAgg.length > 0 ? categoryAgg[0]._id : 'None';
    const totalEmissions = categoryAgg.reduce((acc, curr) => acc + curr.total, 0);

    const totalActivities = await Activity.countDocuments({ userId });
    
    // 2. Calculate Sustainability Score
    let sustainabilityScore = 50;
    if (totalActivities > 0) {
      const avgCarbon = totalEmissions / totalActivities;
      sustainabilityScore = Math.max(0, Math.min(100, 100 - (avgCarbon / 10) + (totalActivities * 2)));
      sustainabilityScore = Math.round(sustainabilityScore);
    } else {
      sustainabilityScore = 0;
    }

    // 3. Fetch Forecast
    const forecastRecord = await Forecast.findOne({ userId }).sort({ createdAt: -1 });
    const forecastContext = forecastRecord ? {
      trend: forecastRecord.trend,
      predictedCarbon: forecastRecord.predictedCarbon
    } : { trend: 'Unknown', predictedCarbon: 'Unknown' };

    // 4. Fetch Challenges
    const challenges = await UserChallenge.find({ userId }).populate('challengeId');
    const completedChallenges = challenges.filter(c => c.status === 'completed').length;
    const activeChallenges = challenges.filter(c => c.status === 'active').length;

    // 5. Fetch Achievements
    const achievements = await UserAchievement.find({ userId }).populate('achievementId');
    const earnedBadges = achievements.map(a => a.achievementId?.title || 'Unknown Badge');

    // 6. Fetch Simulator history
    const simulations = await Simulation.find({ userId }).sort({ createdAt: -1 }).limit(3);
    const simSummary = simulations.map(s => s.scenarioName).join(', ') || 'No previous simulations';

    // Construct Context JSON
    const contextSummary = {
      profile: {
        name: user.name,
        goals: user.preferences?.goal || 'Neutrality',
        dietary: user.preferences?.dietary || 'Balanced'
      },
      emissions: {
        totalEmissions: totalEmissions.toFixed(2) + ' tCO2e',
        totalActivities
      },
      topCategory,
      sustainabilityScore,
      forecast: forecastContext,
      challenges: {
        completed: completedChallenges,
        active: activeChallenges
      },
      achievements: earnedBadges,
      recentSimulations: simSummary
    };

    const prompt = `
      You are CarbonSphere AI, a deeply knowledgeable, friendly, and encouraging sustainability copilot.
      The user is asking you for help, advice, or analysis regarding their carbon footprint or sustainability journey.
      
      Below is the user's current sustainability context based on their real data in CarbonSphere AI:
      ${JSON.stringify(contextSummary, null, 2)}
      
      User's Question: "${message}"

      REQUIREMENTS:
      - Personalize your answer using the provided context.
      - Mention actual numbers, categories, and metrics (like their score or emissions) where relevant.
      - Mention their forecast trend or risk level if it makes sense.
      - Acknowledge their completed challenges or earned badges if applicable.
      - If data is mostly empty/zeros, fall back to providing highly actionable standard sustainability advice, encouraging them to log more activities.

      You MUST respond with ONLY a valid, parsable JSON object containing exactly these fields:
      - "content": A string containing your detailed, helpful, and formatted markdown response to the user.
      - "impact": A string that is exactly one of: "High", "Medium", or "Low" representing the potential emission impact of your advice.
      - "actionability": A number between 0 and 100 representing how easy and actionable your advice is.

      Do not include any markdown backticks around the JSON. Just return the raw JSON object.
    `;

    const aiResponse = await groqService.generateAssistantResponse(prompt);

    res.status(200).json({
      success: true,
      data: aiResponse,
      contextUsed: contextSummary // Exposing this so we can inspect it later if needed
    });
  } catch (error) {
    console.error('AI Assistant Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to communicate with AI Assistant',
      error: error.message
    });
  }
};

module.exports = {
  chatWithAssistant
};
