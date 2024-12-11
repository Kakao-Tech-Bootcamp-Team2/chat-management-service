const jwt = require('jsonwebtoken');
require('dotenv').config();

// 테스트용 사용자 데이터
const testUser = {
  id: '1234567890',  // 테스트 사용자 ID
  sessionId: 'test-session-123',  // 테스트 세션 ID
  role: 'user'  // 사용자 역할
};

// JWT 토큰 생성
const token = jwt.sign(
  testUser,
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);

console.log('Test JWT Token:', token); 