const mongoose = require('mongoose');

const CarbonLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    activityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Activity',
      required: true
    },
    carbonEmission: {
      type: Number,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    month: {
      type: String
    },
    year: {
      type: Number
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('CarbonLog', CarbonLogSchema);
