require('dotenv').config();
console.log("Server starting...");

const logger = require('./src/utils/logger.js');
const mongoose = require('mongoose');

let server;

const gracefulShutdown = (signal, err) => {
  if (err) {
    logger.error(`${signal} occurred! Shutting down gracefully...`, err);
  } else {
    logger.info(`${signal} received! Shutting down gracefully...`);
  }

  if (server) {
    logger.info('Closing HTTP server...');
    server.close(async () => {
      logger.info('HTTP server closed.');
      try {
        await mongoose.disconnect();
        logger.info('MongoDB connection closed.');
        process.exit(err ? 1 : 0);
      } catch (dbErr) {
        logger.error('Error closing MongoDB connection:', dbErr);
        process.exit(1);
      }
    });
  } else {
    process.exit(err ? 1 : 0);
  }

  // Force close after 10 seconds if hanging
  setTimeout(() => {
    logger.error('Forced shutdown due to timeout.');
    process.exit(1);
  }, 10000);
};

process.on('uncaughtException', (err) => {
  gracefulShutdown('UNCAUGHT EXCEPTION', err);
});

process.on('unhandledRejection', (err) => {
  gracefulShutdown('UNHANDLED REJECTION', err);
});

process.on('SIGTERM', () => {
  gracefulShutdown('SIGTERM');
});

process.on('SIGINT', () => {
  gracefulShutdown('SIGINT');
});

const app = require('./src/app.js');
const connectDB = require('./src/config/db.js');

const PORT = process.env.PORT || 5000;

// Connect MongoDB before server starts
connectDB().then(() => {
  server = app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
});
