require('dotenv').config();

module.exports = {
  app: {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5004,
    serviceName: process.env.SERVICE_NAME || 'chat-management-service'
  },
  db: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/chat_management'
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    db: parseInt(process.env.REDIS_DB) || 0
  },
  ai: {
    wayneAI: {
      defaultPrompt: process.env.WAYNE_AI_DEFAULT_PROMPT,
      defaultTemperature: parseFloat(process.env.WAYNE_AI_TEMPERATURE) || 0.7
    },
    consultingAI: {
      defaultPrompt: process.env.CONSULTING_AI_DEFAULT_PROMPT,
      defaultTemperature: parseFloat(process.env.CONSULTING_AI_TEMPERATURE) || 0.5
    }
  },
  logging: {
    level: process.env.LOG_LEVEL || 'debug',
    dir: process.env.LOG_DIR || 'logs'
  },
  cors: {
    origins: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:3000']
  }
};