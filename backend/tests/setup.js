import { beforeAll, afterAll } from 'vitest';
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

beforeAll(async () => {
  // Close any existing connections before establishing a new one
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  
  const uri = process.env.MONGODB_URI;
  await mongoose.connect(uri, { dbName: 'carbonsphere_test' });
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
});

import { afterEach } from 'vitest';
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
});
