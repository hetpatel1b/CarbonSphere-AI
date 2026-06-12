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
const simulatorRoutes = require('./routes/simulatorRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const actionRoutes = require('./routes/actionRoutes');
const demoRoutes = require('./routes/demoRoutes');

// Create Express app instance
const app = express();

const crypto = require('crypto');
app.use((req, res, next) => {
  const correlationId = req.header('x-correlation-id') || crypto.randomUUID();
  req.correlationId = correlationId;
  res.setHeader('x-correlation-id', correlationId);
  next();
});

const cookieParser = require('cookie-parser');

// Middleware
// 1. Set Security Headers
app.use(helmet());

// Apply CORS with credentials enabled for cookies
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(cookieParser());

// CSRF Protection Middleware
app.use((req, res, next) => {
  const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:3000';
  const origin = req.headers.origin || req.headers.referer;
  
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    if (origin) {
      try {
        const originUrl = new URL(origin);
        const allowedUrl = new URL(allowedOrigin);
        if (originUrl.host !== allowedUrl.host) {
          return res.status(403).json({ success: false, message: 'CSRF validation failed: origin mismatch' });
        }
      } catch (err) {
        return res.status(403).json({ success: false, message: 'CSRF validation failed: invalid origin header' });
      }
    }
  }
  next();
});

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
app.use('/api/simulator', simulatorRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/actions', actionRoutes);
app.use('/api/demo', demoRoutes);

// Health check route
app.get('/api/health/ai', (req, res) => {
  const groqService = require('./services/groqService');
  res.status(200).json(groqService.getHealthStats());
});

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: "CarbonSphere Backend Running"
  });
});

// 404 handler for API routes
app.use('/api', (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.originalUrl}`
  });
});

const logger = require('./utils/logger');

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  logger.error({
    message: err.message || 'Unhandled error',
    stack: err.stack,
    statusCode,
    url: req.originalUrl,
    method: req.method,
    correlationId: req.correlationId,
    ip: req.ip
  });

  res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === 'production' && statusCode === 500 ? 'Internal Server Error' : message,
    correlationId: req.correlationId,
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
  });
});

// Export app
module.exports = app;
