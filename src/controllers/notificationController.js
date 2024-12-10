const NotificationService = require('../services/notificationService');
const { createLogger } = require('../utils/logger');
const logger = createLogger('NotificationController');

class NotificationController {
  // 알림 목록 조회
  async getNotifications(req, res) {
    try {
      const userId = req.user.id;
      const { limit = 20, offset = 0, type } = req.query;

      const notifications = await NotificationService.getUserNotifications(
        userId, 
        { limit, offset, type }
      );

      res.status(200).json({
        success: true,
        data: {
          notifications,
          hasMore: notifications.length === limit,
          totalUnread: await NotificationService.getUnreadCount(userId)
        }
      });
    } catch (error) {
      logger.error('Failed to get notifications:', error);
      res.status(500).json({
        success: false,
        error: error.message || '알림을 불러오는데 실패했습니다.'
      });
    }
  }

  // 알림 읽음 처리
  async markAsRead(req, res) {
    try {
      const { notificationId } = req.params;
      const userId = req.user.id;

      const notification = await NotificationService.markAsRead(notificationId, userId);
      const totalUnread = await NotificationService.getUnreadCount(userId);

      res.status(200).json({
        success: true,
        data: {
          notification,
          totalUnread
        }
      });
    } catch (error) {
      logger.error('Failed to mark notification as read:', error);
      res.status(500).json({
        success: false,
        error: error.message || '알림 읽음 처리에 실패했습니다.'
      });
    }
  }

  // 모든 알림 읽음 처리
  async markAllAsRead(req, res) {
    try {
      const userId = req.user.id;
      await NotificationService.markAllAsRead(userId);
      
      res.status(200).json({
        success: true,
        data: {
          totalUnread: 0,
          message: '모든 알림이 읽음 처리되었습니다.'
        }
      });
    } catch (error) {
      logger.error('Failed to mark all notifications as read:', error);
      res.status(500).json({
        success: false,
        error: error.message || '알림 일괄 읽음 처리에 실패했습니다.'
      });
    }
  }

  // 알림 삭제
  async deleteNotification(req, res) {
    try {
      const { notificationId } = req.params;
      const userId = req.user.id;

      await NotificationService.deleteNotification(notificationId, userId);
      const totalUnread = await NotificationService.getUnreadCount(userId);

      res.status(200).json({
        success: true,
        data: {
          totalUnread,
          message: '알림이 삭제되었습니다.'
        }
      });
    } catch (error) {
      logger.error('Failed to delete notification:', error);
      res.status(500).json({
        success: false,
        error: error.message || '알림 삭제에 실패했습니다.'
      });
    }
  }

  // 알림 설정 업데이트
  async updateSettings(req, res) {
    try {
      const userId = req.user.id;
      const { settings } = req.body;

      const updatedSettings = await NotificationService.updateSettings(userId, settings);

      res.status(200).json({
        success: true,
        data: {
          settings: updatedSettings
        }
      });
    } catch (error) {
      logger.error('Failed to update notification settings:', error);
      res.status(500).json({
        success: false,
        error: error.message || '알림 설정 업데이트에 실패했습니다.'
      });
    }
  }

  // 알림 구독 상태 확인
  async getSubscriptionStatus(req, res) {
    try {
      const userId = req.user.id;
      const status = await NotificationService.getSubscriptionStatus(userId);

      res.status(200).json({
        success: true,
        data: {
          status
        }
      });
    } catch (error) {
      logger.error('Failed to get subscription status:', error);
      res.status(500).json({
        success: false,
        error: error.message || '구독 상태 확인에 실패했습니다.'
      });
    }
  }
}

module.exports = new NotificationController();