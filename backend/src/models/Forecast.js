const mongoose = require('mongoose');

const ForecastSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    month: {
      type: String,
      required: true
    },
    currentCarbon: {
      type: Number,
      required: true
    },
    predictedCarbon: {
      type: Number,
      required: true
    },
    reductionPercentage: {
      type: Number,
      default: 0
    },
    trend: {
      type: String,
      enum: ['increasing', 'decreasing', 'stable'],
      default: 'stable'
    }
  },
  {
    timestamps: true
  }
);

ForecastSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Forecast', ForecastSchema);
