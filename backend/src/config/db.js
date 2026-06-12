const mongoose = require('mongoose');

// Mongoose connection lifecycle listeners
mongoose.connection.on('connected', () => {
  console.log('MongoDB connection established successfully.');
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB connection lost!');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error occurred:', err.message);
});

const connectDB = async (retries = 5, delay = 5000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Connecting to MongoDB (Attempt ${attempt}/${retries})...`);
      await mongoose.connect(process.env.MONGODB_URI);
      return;
    } catch (error) {
      console.error(`MongoDB connection attempt ${attempt} failed: ${error.message}`);
      if (attempt < retries) {
        console.log(`Retrying in ${delay / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.error('CRITICAL: MongoDB connection attempts exhausted. Shutting down server.');
        process.exit(1);
      }
    }
  }
};

module.exports = connectDB;
