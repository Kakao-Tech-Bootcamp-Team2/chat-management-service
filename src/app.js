const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const { createLogger } = require('./utils/logger');
const { errorHandler, notFound } = require('./middlewares/errorHandler');
const connectDB = require('./config/database');

const logger = createLogger('App');

// Express 앱 초기화
const app = express();

// 미들웨어 설정
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 요청 로깅
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  logger.debug('Request Headers:', JSON.stringify(req.headers)); // 헤더 정보 로그 추가
  next();
});

// 헬스 체크 (root level)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    success: true,
    data: {
      service: 'chat-management-service',
      status: 'ok',
      timestamp: new Date().toISOString()
    }
  });
});

// 라우트 설정
app.use('/api/v1', require('./routes'));

// 404 처리
app.use(notFound);

// 에러 처리
app.use(errorHandler);

// 서버 시작
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // MongoDB 연결
    await connectDB();
    logger.info('MongoDB Connected');

    // 서버 시작
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// 프로세스 에러 처리
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

startServer();

module.exports = app;