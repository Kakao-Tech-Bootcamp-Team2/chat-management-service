const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/notificationController');
const { validateRequest } = require('../middlewares/validator');

// 알림 목록 조회
router.get('/',
  validateRequest({
    query: {
      limit: { type: 'number', required: false }
    }
  }),
  NotificationController.getNotifications
);

// 알림 읽음 처리
router.patch('/:notificationId/read',
  validateRequest({
    params: {
      notificationId: { type: 'string', required: true }
    }
  }),
  NotificationController.markAsRead
);

// 모든 알림 읽음 처리
router.patch('/read-all',
  NotificationController.markAllAsRead
);

// 알림 삭제
router.delete('/:notificationId',
  validateRequest({
    params: {
      notificationId: { type: 'string', required: true }
    }
  }),
  NotificationController.deleteNotification
);

module.exports = router;