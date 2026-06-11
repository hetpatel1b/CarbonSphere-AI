  const mongoose = require('mongoose');
const dotenv = require('dotenv');
const OffsetProject = require('./src/models/OffsetProject');

dotenv.config();

const seedData = [
  {
    name: "Amazon Rainforest Protection",
    category: "Reforestation",
    location: "Brazil",
    description: "Protecting thousands of hectares of endangered rainforest from deforestation, preserving critical biodiversity.",
    capacity: 100000,
    costPerTon: 12,
    rating: "Gold Standard",
    image: "/placeholder.svg?height=200&width=300",
    availableCredits: 85400
  },
  {
    name: "Rajasthan Solar Expansion",
    category: "Renewable Energy",
    location: "India",
    description: "Funding the construction of large-scale solar arrays to displace coal power in the local grid.",
    capacity: 250000,
    costPerTon: 9,
    rating: "VCS",
    image: "/placeholder.svg?height=200&width=300",
    availableCredits: 190200
  },
  {
    name: "Pacific Ocean Cleanup",
    category: "Ocean Cleanup",
    location: "Global",
    description: "Removing plastics and investing in blue carbon sequestration via kelp forest restoration.",
    capacity: 50000,
    costPerTon: 22,
    rating: "Verified Carbon Standard",
    image: "/placeholder.svg?height=200&width=300",
    availableCredits: 42000
  },
  {
    name: "Kenya Clean Water Access",
    category: "Water Conservation",
    location: "Kenya",
    description: "Providing clean water access, reducing the need to boil water with firewood, reducing emissions and deforestation.",
    capacity: 75000,
    costPerTon: 14,
    rating: "Gold Standard",
    image: "/placeholder.svg?height=200&width=300",
    availableCredits: 61000
  },
  {
    name: "Midwest Regenerative Farming",
    category: "Sustainable Agriculture",
    location: "United States",
    description: "Transitioning conventional farms to regenerative practices to sequester carbon directly into the soil.",
    capacity: 120000,
    costPerTon: 18,
    rating: "CarbonFuture",
    image: "/placeholder.svg?height=200&width=300",
    availableCredits: 115000
  }
];

const seedOffsets = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding...');

    await OffsetProject.deleteMany();
    console.log('Cleared existing offset projects.');

    await OffsetProject.insertMany(seedData);
    console.log('Offset projects seeded successfully!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding offset projects:', error);
    process.exit(1);
  }
};

seedOffsets();
