const mongoose = require('mongoose');

const OffsetPurchaseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OffsetProject',
      required: true
    },
    credits: {
      type: Number,
      required: true // amount of tCO2e purchased
    },
    cost: {
      type: Number,
      required: true // total cost of the purchase
    }
  },
  {
    timestamps: true
  }
);

OffsetPurchaseSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('OffsetPurchase', OffsetPurchaseSchema);
