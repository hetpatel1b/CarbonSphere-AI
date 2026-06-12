import { beforeAll, afterAll, afterEach } from 'vitest';
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
require('dotenv').config({ path: '.env' });

let mongoServer;

beforeAll(async () => {
  // Close any existing connections before establishing a new one
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  
  if (process.env.CI || !process.env.MONGODB_URI) {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  } else {
    const uri = process.env.MONGODB_URI;
    await mongoose.connect(uri, { dbName: 'carbonsphere_test' });
  }
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
