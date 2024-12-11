const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/notificationController');
const { validateRequest } = require('../middlewares/validator');
const auth = require('../middlewares/auth');

// 알림 목록 조회
router.get('/',
  auth,
  validateRequest({
    query: {
      limit: { type: 'number', required: false },
      offset: { type: 'number', required: false },
      type: { type: 'string', required: false }
    }
  }),
  NotificationController.getNotifications
);

// 알림 읽음 처리
router.patch('/:notificationId/read',
  auth,
  validateRequest({
    params: {
      notificationId: { type: 'string', required: true }
    }
  }),
  NotificationController.markAsRead
);

// 모든 알림 읽음 처리
router.patch('/read-all',
  auth,
  validateRequest({
    query: {
      type: { type: 'string', required: false }
    }
  }),
  NotificationController.markAllAsRead
);

// 알림 삭제
router.delete('/:notificationId',
  auth,
  validateRequest({
    params: {
      notificationId: { type: 'string', required: true }
    }
  }),
  NotificationController.deleteNotification
);

// 알림 설정 조회
router.get('/settings',
  auth,
  NotificationController.getSettings
);

// 알림 설정 업데이트
router.put('/settings',
  auth,
  validateRequest({
    body: {
      enabled: { type: 'boolean', required: false },
      types: { type: 'object', required: false }
    }
  }),
  NotificationController.updateSettings
);

module.exports = router;