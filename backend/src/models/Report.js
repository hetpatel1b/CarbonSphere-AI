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
      enum: ['monthly', 'annual', 'comprehensive'],
      required: true
    },
    reportData: {
      type: mongoose.Schema.Types.Mixed,
      required: true
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
