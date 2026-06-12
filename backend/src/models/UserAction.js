const mongoose = require('mongoose');

const UserActionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  actionTitle: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: 'General'
  },
  reduction: {
    type: Number,
    required: true,
    default: 0
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  impact: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['active', 'completed'],
    default: 'active'
  },
  appliedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

UserActionSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('UserAction', UserActionSchema);
