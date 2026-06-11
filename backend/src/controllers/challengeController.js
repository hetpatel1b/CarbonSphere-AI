const Challenge = require('../models/Challenge');
const UserChallenge = require('../models/UserChallenge');
const { createNotification } = require('./notificationController');

// @desc    Get all active challenges
// @route   GET /api/challenges
// @access  Private
const getAllChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find({ isActive: true }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: challenges.length,
      data: challenges
    });
  } catch (error) {
    console.error(`Error in getAllChallenges: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get user's joined challenges
// @route   GET /api/challenges/my
// @access  Private
const getMyChallenges = async (req, res) => {
  try {
    const userId = req.user.id;
    const myChallenges = await UserChallenge.find({ userId })
      .populate('challengeId')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: myChallenges.length,
      data: myChallenges
    });
  } catch (error) {
    console.error(`Error in getMyChallenges: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get single challenge
// @route   GET /api/challenges/:id
// @access  Private
const getChallengeById = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found'
      });
    }
    return res.status(200).json({
      success: true,
      data: challenge
    });
  } catch (error) {
    console.error(`Error in getChallengeById: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    User joins challenge
// @route   POST /api/challenges/join/:id
// @access  Private
const joinChallenge = async (req, res) => {
  try {
    const challengeId = req.params.id;
    const userId = req.user.id;

    // Check if challenge exists
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found'
      });
    }

    if (!challenge.isActive) {
       return res.status(400).json({
        success: false,
        message: 'Challenge is not active'
      });
    }

    // Check if user already joined
    const existing = await UserChallenge.findOne({ userId, challengeId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already joined this challenge'
      });
    }

    // Create UserChallenge
    const userChallenge = await UserChallenge.create({
      userId,
      challengeId
    });

    // Trigger Notification
    await createNotification(
      userId,
      "Challenge Joined!",
      `You successfully joined the '${challenge.title}' challenge. Good luck!`,
      'challenge'
    );

    // Add user to challenge participants
    if (!challenge.participants.includes(userId)) {
      challenge.participants.push(userId);
      await challenge.save();
    }

    return res.status(201).json({
      success: true,
      data: userChallenge
    });
  } catch (error) {
    console.error(`Error in joinChallenge: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Update challenge progress
// @route   PATCH /api/challenges/progress/:id
// @access  Private
const updateChallengeProgress = async (req, res) => {
  try {
    const challengeId = req.params.id; // the challenge ID
    const userId = req.user.id;
    const { progress } = req.body;

    if (progress === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide progress value'
      });
    }

    const userChallenge = await UserChallenge.findOne({ userId, challengeId }).populate('challengeId');
    if (!userChallenge) {
      return res.status(404).json({
        success: false,
        message: 'You have not joined this challenge'
      });
    }

    if (userChallenge.completed) {
      return res.status(400).json({
        success: false,
        message: 'Challenge already completed'
      });
    }

    // Update progress
    userChallenge.progress = progress;

    // Check if completed based on challenge targetValue
    if (userChallenge.challengeId && userChallenge.progress >= userChallenge.challengeId.targetValue) {
      userChallenge.progress = userChallenge.challengeId.targetValue;
      userChallenge.completed = true;
    }

    await userChallenge.save();

    return res.status(200).json({
      success: true,
      data: userChallenge
    });
  } catch (error) {
    console.error(`Error in updateChallengeProgress: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

module.exports = {
  getAllChallenges,
  getMyChallenges,
  getChallengeById,
  joinChallenge,
  updateChallengeProgress
};
