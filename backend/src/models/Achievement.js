const mongoose = require('mongoose');

const AchievementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    badgeIcon: {
      type: String,
      default: 'default-badge.png'
    },
    points: {
      type: Number,
      default: 0
    },
    category: {
      type: String,
      required: true
    },
    criteria: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Achievement', AchievementSchema);
