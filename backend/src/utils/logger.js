const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'carbonsphere-backend' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, stack, service, ...meta }) => {
          const correlationInfo = meta.correlationId ? ` [CorrelationID: ${meta.correlationId}]` : '';
          const logStack = stack ? `\n${stack}` : '';
          return `[${timestamp}] ${level}:${correlationInfo} ${message}${logStack}`;
        })
      )
    })
  ]
});

module.exports = logger;
