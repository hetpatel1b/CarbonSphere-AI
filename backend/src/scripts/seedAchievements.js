const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Achievement = require('../models/Achievement');

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const achievements = [
  {
    title: "First Step",
    description: "Logged your first eco-friendly activity.",
    badgeIcon: "Leaf",
    points: 50,
    category: "Community",
    criteria: { type: 'count', target: 1 },
    isActive: true
  },
  {
    title: "Eco Starter",
    description: "Unlock after 5 activities.",
    badgeIcon: "Zap",
    points: 150,
    category: "Energy",
    criteria: { type: 'count', target: 5 },
    isActive: true
  },
  {
    title: "Carbon Warrior",
    description: "Unlock after 25 activities.",
    badgeIcon: "Target",
    points: 300,
    category: "Community",
    criteria: { type: 'count', target: 25 },
    isActive: true
  },
  {
    title: "Consistency Champion",
    description: "Unlock after 7 consecutive days of activity.",
    badgeIcon: "Wind",
    points: 350,
    category: "Community",
    criteria: { type: 'consecutive_days', target: 7 },
    isActive: true
  },
  {
    title: "Eco Master",
    description: "Unlock after 100 activities.",
    badgeIcon: "Award",
    points: 500,
    category: "Community",
    criteria: { type: 'count', target: 100 },
    isActive: true
  },
  {
    title: "Low Carbon Hero",
    description: "Unlock when total emissions remain below defined threshold.",
    badgeIcon: "Crown",
    points: 1000,
    category: "Community",
    criteria: { type: 'emission_threshold', minCount: 10, maxAvg: 10 }, // Assuming 10kg avg over 10 activities
    isActive: true
  }
];

const seedAchievements = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/carbonsphere';
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected for Seeding...');

    // Delete existing achievements to avoid duplicates (or we could use upsert)
    await Achievement.deleteMany();
    console.log('Existing achievements cleared.');

    await Achievement.insertMany(achievements);
    console.log('Achievements successfully seeded!');

    process.exit(0);
  } catch (error) {
    console.error(`Error seeding data: ${error.message}`);
    process.exit(1);
  }
};

seedAchievements();
