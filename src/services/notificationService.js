const Notification = require('../models/Notification');
const { createLogger } = require('../utils/logger');
const logger = createLogger('NotificationService');

class NotificationService {
  // 알림 생성
  async createNotification(userId, type, title, content, roomId = null, messageId = null) {
    try {
      const notification = new Notification({
        userId,
        type,
        title,
        content,
        roomId,
        messageId
      });

      return await notification.save();
    } catch (error) {
      logger.error('Create notification failed:', error);
      throw error;
    }
  }

  // 사용자의 알림 목록 조회
  async getUserNotifications(userId, { limit = 20, offset = 0, type = null }) {
    try {
      const query = { userId };
      if (type) {
        query.type = type;
      }

      return await Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit);
    } catch (error) {
      logger.error('Get notifications failed:', error);
      throw error;
    }
  }

  // 알림 읽음 처리
  async markAsRead(userId, notificationId) {
    try {
      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, userId },
        { isRead: true },
        { new: true }
      );

      if (!notification) {
        throw new Error('Notification not found');
      }

      return notification;
    } catch (error) {
      logger.error('Mark as read failed:', error);
      throw error;
    }
  }

  // 모든 알림 읽음 처리
  async markAllAsRead(userId, type = null) {
    try {
      const query = { userId, isRead: false };
      if (type) {
        query.type = type;
      }

      await Notification.updateMany(query, { isRead: true });
    } catch (error) {
      logger.error('Mark all as read failed:', error);
      throw error;
    }
  }

  // 알림 삭제
  async deleteNotification(userId, notificationId) {
    try {
      const notification = await Notification.findOneAndDelete({
        _id: notificationId,
        userId
      });

      if (!notification) {
        throw new Error('Notification not found');
      }
    } catch (error) {
      logger.error('Delete notification failed:', error);
      throw error;
    }
  }

  // 알림 설정 조회
  async getSettings(userId) {
    try {
      // 임시로 기본 설정 반환
      return {
        enabled: true,
        types: {
          mention: true,
          invite: true,
          system: true
        }
      };
    } catch (error) {
      logger.error('Get settings failed:', error);
      throw error;
    }
  }

  // 알림 설정 업데이트
  async updateSettings(userId, settings) {
    try {
      // TODO: 실제 설정 저장 구현
      return settings;
    } catch (error) {
      logger.error('Update settings failed:', error);
      throw error;
    }
  }
}

module.exports = new NotificationService();