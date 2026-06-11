const Offset = require('../models/Offset');
const mongoose = require('mongoose');

// @desc    Create a new carbon offset
// @route   POST /api/offsets
// @access  Private
const createOffset = async (req, res) => {
  try {
    const userId = req.user.id;
    const { offsetType, description, carbonOffsetAmount, provider, cost, verificationId } = req.body;

    if (!offsetType || !carbonOffsetAmount || !provider || !cost) {
      return res.status(400).json({
        success: false,
        message: 'Please provide offsetType, carbonOffsetAmount, provider, and cost'
      });
    }

    const newOffset = await Offset.create({
      userId,
      offsetType,
      description,
      carbonOffsetAmount,
      provider,
      cost,
      verificationId
    });

    return res.status(201).json({
      success: true,
      data: newOffset
    });
  } catch (error) {
    console.error(`Error in createOffset: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get user's offsets
// @route   GET /api/offsets
// @access  Private
const getMyOffsets = async (req, res) => {
  try {
    const userId = req.user.id;
    const offsets = await Offset.find({ userId })
      .populate('userId', 'name email avatar')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: offsets.length,
      data: offsets
    });
  } catch (error) {
    console.error(`Error in getMyOffsets: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get offset summary
// @route   GET /api/offsets/summary
// @access  Private
const getOffsetSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const objectIdUser = new mongoose.Types.ObjectId(userId);

    // Overall summary metrics
    const summaryAgg = await Offset.aggregate([
      { $match: { userId: objectIdUser } },
      {
        $group: {
          _id: null,
          totalOffsets: { $sum: 1 },
          totalCarbonOffset: { $sum: '$carbonOffsetAmount' },
          totalCost: { $sum: '$cost' }
        }
      }
    ]);

    // Offsets grouped by type
    const offsetsByTypeAgg = await Offset.aggregate([
      { $match: { userId: objectIdUser } },
      {
        $group: {
          _id: '$offsetType',
          totalCarbon: { $sum: '$carbonOffsetAmount' },
          totalCost: { $sum: '$cost' },
          count: { $sum: 1 }
        }
      },
      { $sort: { totalCarbon: -1 } }
    ]);

    const summary = summaryAgg.length > 0 ? summaryAgg[0] : { totalOffsets: 0, totalCarbonOffset: 0, totalCost: 0 };
    delete summary._id; // Remove the null _id field
    
    // Format the grouping
    const offsetsByType = offsetsByTypeAgg.map(item => ({
      offsetType: item._id,
      totalCarbon: item.totalCarbon,
      totalCost: item.totalCost,
      count: item.count
    }));

    return res.status(200).json({
      success: true,
      data: {
        totalOffsets: summary.totalOffsets,
        totalCarbonOffset: summary.totalCarbonOffset,
        totalCost: summary.totalCost,
        offsetsByType
      }
    });

  } catch (error) {
    console.error(`Error in getOffsetSummary: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get single offset by ID
// @route   GET /api/offsets/:id
// @access  Private
const getOffsetById = async (req, res) => {
  try {
    // Only return if it belongs to the authenticated user
    const offset = await Offset.findOne({ _id: req.params.id, userId: req.user.id })
      .populate('userId', 'name email avatar');

    if (!offset) {
      return res.status(404).json({
        success: false,
        message: 'Offset not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: offset
    });
  } catch (error) {
    console.error(`Error in getOffsetById: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  createOffset,
  getMyOffsets,
  getOffsetSummary,
  getOffsetById
};
