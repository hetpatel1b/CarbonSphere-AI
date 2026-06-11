const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');

// Import routes
const authRoutes = require('./routes/authRoutes');
const activityRoutes = require('./routes/activityRoutes');
const carbonLogRoutes = require('./routes/carbonLogRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const forecastRoutes = require('./routes/forecastRoutes');
const challengeRoutes = require('./routes/challengeRoutes');
const achievementRoutes = require('./routes/achievementRoutes');
const reportRoutes = require('./routes/reportRoutes');
const offsetRoutes = require('./routes/offsetRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const aiCoachRoutes = require('./routes/aiCoachRoutes');
const assistantRoutes = require('./routes/assistantRoutes');
const communityRoutes = require('./routes/communityRoutes');

// Create Express app instance
const app = express();

// Middleware
// 1. Set Security Headers
app.use(helmet());

// Apply CORS before rate limiter so 429 responses get CORS headers
app.use(cors());

// 2. Rate Limiting (100 req per 15 min)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes'
  }
});
app.use('/api/', apiLimiter);

// 3. Response Compression
app.use(compression());

// 4. HTTP Request Logging (Development Only)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json()); // Enable JSON body parsing

// Mount auth routes
app.use('/api/auth', authRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/carbonlogs', carbonLogRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/forecast', forecastRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/offsets', offsetRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai-coach', aiCoachRoutes);
app.use('/api/assistant', assistantRoutes);
app.use('/api/community', communityRoutes);

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: "CarbonSphere Backend Running"
  });
});

// Export app
module.exports = app;
