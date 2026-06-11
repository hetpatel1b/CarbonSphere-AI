const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Challenge = require('../models/Challenge');
const connectDB = require('../config/db');

// Load env vars
// Path is relative to the directory where the script is run (backend root)
dotenv.config();

const challenges = [
  {
    title: "Reduce Travel Emissions",
    description: "Commit to reducing your overall travel carbon footprint by choosing low-carbon transport options.",
    targetValue: 50,
    category: "Transport",
    rewardPoints: 100,
    difficulty: "medium",
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
  },
  {
    title: "Use Public Transport",
    description: "Take public transit instead of driving for your daily commute.",
    targetValue: 10,
    category: "Transport",
    rewardPoints: 50,
    difficulty: "easy",
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 14))
  },
  {
    title: "Plant 5 Trees",
    description: "Join local community efforts to plant at least 5 trees.",
    targetValue: 5,
    category: "Nature",
    rewardPoints: 200,
    difficulty: "hard",
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 2))
  },
  {
    title: "Reduce Electricity Usage",
    description: "Lower your monthly electricity consumption by 10%.",
    targetValue: 10,
    category: "Energy",
    rewardPoints: 150,
    difficulty: "medium",
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
  },
  {
    title: "Zero Plastic Week",
    description: "Avoid single-use plastics completely for one whole week.",
    targetValue: 7,
    category: "Lifestyle",
    rewardPoints: 80,
    difficulty: "medium",
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 7))
  },
  {
    title: "Bike to Work",
    description: "Commute to work using your bicycle instead of a car.",
    targetValue: 5,
    category: "Transport",
    rewardPoints: 120,
    difficulty: "medium",
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 14))
  },
  {
    title: "Save Water Challenge",
    description: "Reduce your daily shower time and fix all leaking taps.",
    targetValue: 20,
    category: "Conservation",
    rewardPoints: 75,
    difficulty: "easy",
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
  },
  {
    title: "Sustainable Shopping",
    description: "Only buy locally sourced products with eco-friendly packaging.",
    targetValue: 10,
    category: "Lifestyle",
    rewardPoints: 90,
    difficulty: "medium",
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
  },
  {
    title: "Carpool Challenge",
    description: "Share rides with colleagues or friends at least 5 times.",
    targetValue: 5,
    category: "Transport",
    rewardPoints: 100,
    difficulty: "easy",
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 30))
  },
  {
    title: "Green Energy Usage",
    description: "Switch to a green energy provider or install solar panels.",
    targetValue: 1,
    category: "Energy",
    rewardPoints: 500,
    difficulty: "hard",
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 6))
  }
];

const seedChallenges = async () => {
  try {
    // Connect to database
    await connectDB();

    // Check if challenges already exist
    const count = await Challenge.countDocuments();
    if (count === 0) {
      await Challenge.insertMany(challenges);
      console.log('Sample challenges successfully seeded!');
    } else {
      console.log('Challenge collection is not empty. Seeding skipped.');
    }

    process.exit(0);
  } catch (error) {
    console.error(`Error with seeding data: ${error.message}`);
    process.exit(1);
  }
};

seedChallenges();
