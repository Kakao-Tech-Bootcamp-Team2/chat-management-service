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
          hasMore: notifications.length === limit
        }
      });
    } catch (error) {
      logger.error('Get notifications failed:', error);
      res.status(500).json({
        success: false,
        error: error.message || '알림 목록을 불러오는데 실패했습니다.'
      });
    }
  }

  // 알림 읽음 처리
  async markAsRead(req, res) {
    try {
      const userId = req.user.id;
      const { notificationId } = req.params;

      await NotificationService.markAsRead(userId, notificationId);

      res.status(200).json({
        success: true,
        message: '알림이 읽음 처리되었습니다.'
      });
    } catch (error) {
      logger.error('Mark notification as read failed:', error);
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
      const { type } = req.query;

      await NotificationService.markAllAsRead(userId, type);

      res.status(200).json({
        success: true,
        message: '모든 알림이 읽음 처리되었습니다.'
      });
    } catch (error) {
      logger.error('Mark all notifications as read failed:', error);
      res.status(500).json({
        success: false,
        error: error.message || '알림 읽음 처리에 실패했습니다.'
      });
    }
  }

  // 알림 삭제
  async deleteNotification(req, res) {
    try {
      const userId = req.user.id;
      const { notificationId } = req.params;

      await NotificationService.deleteNotification(userId, notificationId);

      res.status(200).json({
        success: true,
        message: '알림이 삭제되었습니다.'
      });
    } catch (error) {
      logger.error('Delete notification failed:', error);
      res.status(500).json({
        success: false,
        error: error.message || '알림 삭제에 실패했습니다.'
      });
    }
  }

  // 알림 설정 조회
  async getSettings(req, res) {
    try {
      const userId = req.user.id;
      const settings = await NotificationService.getSettings(userId);

      res.status(200).json({
        success: true,
        data: settings
      });
    } catch (error) {
      logger.error('Get notification settings failed:', error);
      res.status(500).json({
        success: false,
        error: error.message || '알림 설정을 불러오는데 실패했습니다.'
      });
    }
  }

  // 알림 설정 업데이트
  async updateSettings(req, res) {
    try {
      const userId = req.user.id;
      const settings = req.body;

      const updatedSettings = await NotificationService.updateSettings(userId, settings);

      res.status(200).json({
        success: true,
        data: updatedSettings
      });
    } catch (error) {
      logger.error('Update notification settings failed:', error);
      res.status(500).json({
        success: false,
        error: error.message || '알림 설정 업데이트에 실패했습니다.'
      });
    }
  }
}

module.exports = new NotificationController();