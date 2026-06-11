const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    avatar: {
      type: String,
      default: ""
    },
    location: {
      type: String,
      default: ""
    },
    timezone: {
      type: String,
      default: "utc"
    },
    preferences: {
      goal: { type: String, default: "neutrality" },
      transport: { type: String, default: "public" },
      energy: { type: String, default: "renewable" },
      dietary: { type: String, default: "balanced" },
      compactView: { type: Boolean, default: false },
      darkMode: { type: Boolean, default: true },
      reduceAnimations: { type: Boolean, default: false }
    },
    notifications: {
      weeklyReports: { type: Boolean, default: true },
      aiInsights: { type: Boolean, default: true },
      challengeUpdates: { type: Boolean, default: true },
      achievementAlerts: { type: Boolean, default: true },
      marketplaceUpdates: { type: Boolean, default: false }
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },
    totalCarbonSaved: {
      type: Number,
      default: 0
    },
    totalActivities: {
      type: Number,
      default: 0
    },
    totalChallenges: {
      type: Number,
      default: 0
    },
    totalAchievements: {
      type: Number,
      default: 0
    },
    aiInsight: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", UserSchema);
