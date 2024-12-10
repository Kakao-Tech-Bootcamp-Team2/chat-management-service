const mongoose = require('mongoose');
const config = require('./index');

const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...', config.db.uri);
    
    const conn = await mongoose.connect(config.db.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;