const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Achievement = require('../models/Achievement');
const connectDB = require('../config/db');

// Load env vars
// Path is relative to the directory where the script is run (backend root)
dotenv.config();

const achievements = [
  {
    title: "First Activity",
    description: "Complete your first activity",
    badgeIcon: "🌱",
    points: 10,
    category: "Activity",
    criteria: "1 activity completed",
    isActive: true
  },
  {
    title: "Carbon Saver",
    description: "Save 100kg carbon",
    badgeIcon: "♻️",
    points: 50,
    category: "Carbon",
    criteria: "100kg carbon saved",
    isActive: true
  },
  {
    title: "Eco Warrior",
    description: "Complete 10 activities",
    badgeIcon: "🌍",
    points: 100,
    category: "Activity",
    criteria: "10 activities completed",
    isActive: true
  },
  {
    title: "Challenge Participant",
    description: "Join your first challenge",
    badgeIcon: "🏆",
    points: 25,
    category: "Challenge",
    criteria: "Join 1 challenge",
    isActive: true
  },
  {
    title: "Green Champion",
    description: "Become a sustainability leader",
    badgeIcon: "🥇",
    points: 250,
    category: "Special",
    criteria: "Advanced sustainability milestones",
    isActive: true
  }
];

const seedAchievements = async () => {
  try {
    // Connect to database
    await connectDB();

    // Check if achievements already exist
    const count = await Achievement.countDocuments();
    if (count === 0) {
      await Achievement.insertMany(achievements);
      console.log('Achievements Seeded Successfully');
    } else {
      console.log('Achievement collection is not empty. Seeding skipped to prevent duplicates.');
    }

    process.exit(0);
  } catch (error) {
    console.error(`Error with seeding data: ${error.message}`);
    process.exit(1);
  }
};

seedAchievements();
