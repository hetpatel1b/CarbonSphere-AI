const mongoose = require('mongoose');

const OffsetProjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      enum: ['Reforestation', 'Renewable Energy', 'Ocean Cleanup', 'Water Conservation', 'Sustainable Agriculture', 'Direct Air Capture']
    },
    location: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    capacity: {
      type: Number,
      required: true // Total CO2 offset capacity in tons
    },
    costPerTon: {
      type: Number,
      required: true
    },
    rating: {
      type: String,
      required: true // e.g. Gold Standard, VCS
    },
    image: {
      type: String,
      required: true
    },
    availableCredits: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('OffsetProject', OffsetProjectSchema);
