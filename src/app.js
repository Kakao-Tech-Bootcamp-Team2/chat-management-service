const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const connectDB = require('./config/database');
const routes = require('./routes');
const { errorHandler, notFound } = require('./middlewares/errorHandler');
const { createLogger } = require('./utils/logger');
const config = require('./config');

// Logger 초기화
const logger = createLogger('App');

// Express 앱 초기화
const app = express();

// 데이터베이스 연결
connectDB();

// 미들웨어 설정
app.use(helmet());  // 보안 헤더 설정
app.use(cors());    // CORS 설정
app.use(compression());  // 응답 압축
app.use(express.json()); // JSON 파싱
app.use(express.urlencoded({ extended: true }));

// 로깅 미들웨어
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

// 기본 경로 설정
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Chat Management Service',
    version: '1.0.0'
  });
});

// API 라우트 설정
app.use('/api', routes);

// 404 에러 처리
app.use(notFound);

// 글로벌 에러 핸들러
app.use(errorHandler);

// 서버 시작
const PORT = config.app.port;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
  logger.info(`Environment: ${config.app.env}`);
});

// 예기치 않은 에러 처리
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  // 심각한 에러의 경우 프로세스 종료
  process.exit(1);
});

module.exports = app;