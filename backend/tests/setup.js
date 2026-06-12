import { beforeAll, afterAll, afterEach, vi } from 'vitest';
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
require('dotenv').config({ path: '.env' });

// Mock groqService globally
vi.mock('../src/services/groqService', () => ({
  generateAssistantResponse: vi.fn().mockResolvedValue({
    insight: "Mocked AI sustainability insights. Target reduction in transport emissions.",
    highestRiskArea: "Transport",
    potentialReduction: "12.5%",
    recommendations: [
      {
        title: "Use Public Transit",
        description: "Replace driving with train/bus commute.",
        reduction: "0.5",
        difficulty: "Easy",
        impact: "Medium"
      },
      {
        title: "Unplug Standby Devices",
        description: "Turn off power strips when not in use.",
        reduction: "0.1",
        difficulty: "Easy",
        impact: "Low"
      },
      {
        title: "Transition to Solar energy",
        description: "Install solar panels or subscribe to green power.",
        reduction: "1.2",
        difficulty: "Hard",
        impact: "High"
      },
      {
        title: "Eat Plant-Based Meals",
        description: "Reduce meat consumption to lower agricultural impact.",
        reduction: "0.3",
        difficulty: "Medium",
        impact: "Medium"
      }
    ]
  }),
  getHealthStats: vi.fn().mockReturnValue({
    status: "healthy",
    availableKeys: 1,
    activeKey: 1
  })
}));

// Ensure required environment variables exist for tests in CI
process.env.JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
process.env.GROQ_API_KEY = process.env.GROQ_API_KEY || 'gsk_dummy_key';

let mongoServer;

beforeAll(async () => {
  // Close any existing connections before establishing a new one
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
});
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
});
