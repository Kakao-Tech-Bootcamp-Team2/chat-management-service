const { createLogger } = require('../utils/logger');
const logger = createLogger('AuthMiddleware');

const auth = async (req, res, next) => {
    try {
      // 헤더에서 토큰 가져오기
      const token = req.header('x-auth-token');
      
      if (!token) {
        return res.status(401).json({
          success: false,
          message: '인증 토큰이 없습니다.'
        });
      }
  
      try {
        // 토큰 검증
        const decoded = jwt.verify(token, jwtSecret);
        
        // 사용자 정보를 요청 객체에 추가
        req.user = {
          id: decoded.id
        };
        
        next();
      } catch (err) {
        return res.status(401).json({
          success: false,
          message: '유효하지 않은 토큰입니다.'
        });
      }
    } catch (err) {
      console.error('Auth middleware error:', err);
      res.status(500).json({
        success: false,
        message: '서버 오류가 발생했습니다.'
      });
    }
  };
  
  module.exports = auth;