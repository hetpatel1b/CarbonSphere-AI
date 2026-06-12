const mongoose = require('mongoose');

const SimulationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    scenarioType: {
      type: String,
      required: true
    },
    assumptions: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    results: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

SimulationSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Simulation', SimulationSchema);
