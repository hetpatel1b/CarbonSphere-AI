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

// Dynamic origin check helper
const isOriginAllowed = (origin) => {
  if (!origin) return false;
  
  if (process.env.FRONTEND_URL) {
    try {
      const allowedUrl = new URL(process.env.FRONTEND_URL);
      const originUrl = new URL(origin);
      if (originUrl.host === allowedUrl.host) {
        return true;
      }
    } catch (e) {
      // Ignore URL parsing errors
    }
  }

  if (
    origin.startsWith('http://localhost:') || 
    origin.startsWith('http://127.0.0.1:') || 
    origin === 'http://localhost'
  ) {
    return true;
  }

  try {
    const originUrl = new URL(origin);
    if (originUrl.hostname.endsWith('.vercel.app')) {
      return true;
    }
  } catch (e) {
    // Ignore URL parsing errors
  }

  return false;
};

// Apply CORS with credentials enabled for cookies
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(cookieParser());

// CSRF Protection Middleware
const { generateCsrfToken, verifyCsrfToken } = require('./middleware/csrfMiddleware');
app.use(generateCsrfToken);
app.use(verifyCsrfToken);

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

// Dedicated, stricter auth limiter (5 attempts per 15 minutes)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Too many attempts. Please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

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
const getHealthInfo = (req, res) => {
  const mongoose = require('mongoose');
  const groqService = require('./services/groqService');
  
  const dbState = mongoose.connection.readyState;
  const isDbConnected = dbState === 1;
  const aiStats = groqService.getHealthStats();
  const isAiHealthy = aiStats.status === 'healthy';

  let status = 'healthy';
  let statusCode = 200;

  if (!isDbConnected) {
    status = 'unhealthy';
    statusCode = 503;
  } else if (!isAiHealthy) {
    status = 'degraded';
    statusCode = 200; // Server is up, database is up, but AI features won't work
  }

  res.status(statusCode).json({
    status,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    components: {
      database: {
        status: isDbConnected ? 'connected' : 'disconnected',
        readyState: dbState
      },
      ai: {
        status: aiStats.status,
        availableKeys: aiStats.availableKeys,
        activeKey: aiStats.activeKey
      }
    }
  });
};

app.get('/api/health', getHealthInfo);
app.get('/api/health/ai', getHealthInfo);

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
