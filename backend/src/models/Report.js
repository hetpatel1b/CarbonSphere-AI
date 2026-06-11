const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    reportType: {
      type: String,
      enum: ['monthly', 'weekly', 'summary'],
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    totalActivities: {
      type: Number,
      default: 0
    },
    totalCarbon: {
      type: Number,
      default: 0
    },
    sustainabilityScore: {
      type: Number,
      default: 0
    },
    recommendations: {
      type: [String],
      default: []
    },
    generatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Report', ReportSchema);
