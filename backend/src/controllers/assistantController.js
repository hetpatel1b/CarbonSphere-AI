const User = require('../models/User');
const aiService = require('../services/aiService');

// @desc    Chat with AI Assistant
// @route   POST /api/assistant/chat
// @access  Private
const chatWithAssistant = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ success: false, message: 'AI configuration is missing on the server' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const prompt = `
      You are CarbonSphere AI, a deeply knowledgeable, friendly, and encouraging sustainability copilot.
      The user is asking you for help, advice, or analysis regarding their carbon footprint or sustainability journey.
      
      User's Name: ${user.name}
      User's Question: "${message}"

      You MUST respond with ONLY a valid, parsable JSON object containing exactly these fields:
      - "content": A string containing your detailed, helpful, and formatted markdown response to the user.
      - "impact": A string that is exactly one of: "High", "Medium", or "Low" representing the potential emission impact of your advice.
      - "actionability": A number between 0 and 100 representing how easy and actionable your advice is.

      Do not include any markdown backticks around the JSON. Just return the raw JSON object.
    `;

    const aiResponse = await aiService.generateAssistantResponse(prompt);

    res.status(200).json({
      success: true,
      data: aiResponse
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
