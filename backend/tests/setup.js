import { beforeAll, afterAll, afterEach } from 'vitest';
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
require('dotenv').config({ path: '.env' });

// Ensure required environment variables exist for tests in CI
process.env.JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
process.env.GROQ_API_KEY = 'gsk_dummy_key';
process.env.GROQ_API_KEY_1 = '';
process.env.GROQ_API_KEY_2 = '';
process.env.GROQ_API_KEY_3 = '';

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
