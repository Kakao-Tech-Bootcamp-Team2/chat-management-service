const express = require('express');
const router = express.Router();

const roomRoutes = require('./roomRoutes');
const aiRoutes = require('./aiRoutes');
const notificationRoutes = require('./notificationRoutes');

// API 라우트 설정
router.use('/rooms', roomRoutes);
router.use('/ai', aiRoutes);
router.use('/notifications', notificationRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ 
    success: true,
    data: {
      service: 'chat-management-service',
      status: 'ok',
      timestamp: new Date().toISOString()
    }
  });
});

module.exports = router;