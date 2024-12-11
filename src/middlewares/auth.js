const { createLogger } = require('../utils/logger');
const logger = createLogger('AuthMiddleware');

const auth = (req, res, next) => {
  try {
    const token = req.header('x-auth-token');
    const sessionId = req.header('x-session-id');

    if (!token || !sessionId) {
      return res.status(401).json({
        success: false,
        error: '인증이 필요합니다.'
      });
    }

    // API Gateway에서 인증이 완료된 요청만 전달됨
    next();
  } catch (error) {
    logger.error('Auth middleware error:', error);
    res.status(401).json({
      success: false,
      error: '인증에 실패했습니다.'
    });
  }
};

module.exports = auth; 