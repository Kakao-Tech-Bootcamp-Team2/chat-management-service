require('dotenv').config();

module.exports = {
  app: {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5004,
    serviceName: process.env.SERVICE_NAME || 'chat-management-service'
  },
  db: {
    uri: process.env.MONGODB_URI || 'mongodb://shared-mongodb:27017/chat_management'
  },
  redis: {
    host: process.env.REDIS_HOST || 'shared-redis',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    db: parseInt(process.env.REDIS_DB) || 0
  },
  rabbitmq: {
    url: process.env.RABBITMQ_URL
  },
  ai: {
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      maxContextSize: parseInt(process.env.AI_MAX_CONTEXT_SIZE) || 10,
      defaultModel: process.env.AI_DEFAULT_MODEL || 'gpt-4'
    },
    wayneAI: {
      model: process.env.WAYNE_AI_MODEL || 'gpt-3.5-turbo',
      temperature: parseFloat(process.env.WAYNE_AI_TEMPERATURE) || 0.7
    },
    consultingAI: {
      model: process.env.CONSULTING_AI_MODEL || 'gpt-4',
      temperature: parseFloat(process.env.CONSULTING_AI_TEMPERATURE) || 0.5
    }
  },
  logging: {
    level: process.env.LOG_LEVEL || 'debug',
    dir: process.env.LOG_DIR || 'logs',
    maxSize: process.env.LOG_MAX_SIZE || '10m',
    maxFiles: process.env.LOG_MAX_FILES || 7
  },
  cors: {
    origins: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:3000']
  },
  cache: {
    ttl: parseInt(process.env.CACHE_TTL) || 300
  }
};