const mongoose = require('mongoose');
const config = require('./index');
const { createLogger } = require('../utils/logger');
const logger = createLogger('Database');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.db.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;