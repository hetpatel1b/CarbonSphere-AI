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

module.exports = mongoose.model('Simulation', SimulationSchema);
