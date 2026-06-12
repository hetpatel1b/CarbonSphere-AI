const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    activityType: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    carbonEmission: {
      type: Number,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    title: {
      type: String
    },
    notes: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

ActivitySchema.index({ userId: 1, date: -1 });
ActivitySchema.index({ userId: 1, category: 1 });

module.exports = mongoose.model('Activity', ActivitySchema);
