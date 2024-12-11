const { createLogger } = require('../utils/logger');
const logger = createLogger('ErrorHandler');

const errorHandler = (err, req, res, next) => {
  logger.error('Error:', err);

  // 몽구스 ValidationError 처리
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: Object.values(err.errors).map(e => e.message)
    });
  }

  // 몽구스 CastError 처리 (잘못된 ObjectId 등)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'Invalid ID format'
    });
  }

  // 사용자 정의 에러 처리
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message
    });
  }

  // 기본 서버 에러 처리
  res.status(500).json({
    success: false,
    error: 'Internal Server Error'
  });
};

// 404 에러 처리
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

module.exports = { errorHandler, notFound };