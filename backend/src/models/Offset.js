const mongoose = require('mongoose');

const OffsetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    offsetType: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    carbonOffsetAmount: {
      type: Number,
      required: true
    },
    provider: {
      type: String,
      required: true
    },
    cost: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'verified', 'failed'],
      default: 'pending'
    },
    verificationId: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Offset', OffsetSchema);
