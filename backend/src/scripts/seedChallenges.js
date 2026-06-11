const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Challenge = require('../models/Challenge');

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const challenges = [
  {
    title: "Green Commuter",
    description: "Log 5 transport activities.",
    targetValue: 5,
    category: "Transport",
    rewardPoints: 100,
    difficulty: "medium",
    icon: "Target",
    color: "emerald",
    startDate: new Date(new Date().setDate(new Date().getDate() - 2)), // Started 2 days ago
    endDate: new Date(new Date().setDate(new Date().getDate() + 5)),   // Ends in 5 days
    criteria: { type: 'category_count', category: 'Transport' },
    isActive: true
  },
  {
    title: "Energy Saver",
    description: "Log 3 renewable energy activities.",
    targetValue: 3,
    category: "Energy",
    rewardPoints: 150,
    difficulty: "hard",
    icon: "Zap",
    color: "amber",
    startDate: new Date(new Date().setDate(new Date().getDate() - 1)),
    endDate: new Date(new Date().setDate(new Date().getDate() + 6)),
    criteria: { type: 'category_count', category: 'Energy' },
    isActive: true
  },
  {
    title: "Carbon Reducer",
    description: "Reduce total emissions by 10%.",
    targetValue: 10,
    category: "Reduction",
    rewardPoints: 200,
    difficulty: "hard",
    icon: "Leaf",
    color: "emerald",
    startDate: new Date(new Date().setDate(new Date().getDate() - 5)),
    endDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    criteria: { type: 'emission_reduction', baseline: 50, requiredCount: 10 },
    isActive: true
  },
  {
    title: "Community Hero",
    description: "Participate in 3 community actions.",
    targetValue: 3,
    category: "Community",
    rewardPoints: 120,
    difficulty: "easy",
    icon: "Trophy",
    color: "sky",
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    criteria: { type: 'community_actions' },
    isActive: true
  },
  {
    title: "Eco Streak",
    description: "Log activities for 7 consecutive days.",
    targetValue: 7,
    category: "Streak",
    rewardPoints: 300,
    difficulty: "hard",
    icon: "TrendingUp",
    color: "violet",
    startDate: new Date(new Date().setDate(new Date().getDate() - 3)),
    endDate: new Date(new Date().setDate(new Date().getDate() + 14)),
    criteria: { type: 'consecutive_days' },
    isActive: true
  }
];

const seedChallenges = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/carbonsphere';
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected for Challenge Seeding...');

    // Clear existing challenges
    await Challenge.deleteMany();
    console.log('Existing challenges cleared.');

    await Challenge.insertMany(challenges);
    console.log('Challenges successfully seeded!');

    process.exit(0);
  } catch (error) {
    console.error(`Error seeding challenges: ${error.message}`);
    process.exit(1);
  }
};

seedChallenges();
