const Redis = require('ioredis');
const config = require('./index');
const { createLogger } = require('../utils/logger');
const logger = createLogger('Redis');

const redisClient = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  db: config.redis.db,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3
});

redisClient.on('error', (err) => {
  logger.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  logger.info('Redis Client Connected');
});

module.exports = redisClient;