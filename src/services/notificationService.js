const Notification = require('../models/Notification');

class NotificationService {
  // 알림 생성
  async createNotification(userId, type, content, roomId = null, metadata = {}) {
    try {
      const notification = new Notification({
        userId,
        type,
        content,
        roomId,
        metadata
      });

      return await notification.save();
    } catch (error) {
      throw new Error(`Failed to create notification: ${error.message}`);
    }
  }

  // 사용자의 알림 목록 조회
  async getUserNotifications(userId, limit = 50) {
    try {
      return await Notification.find({ userId })
        .sort({ createdAt: -1 })
        .limit(limit);
    } catch (error) {
      throw new Error(`Failed to get notifications: ${error.message}`);
    }
  }

  // 알림 읽음 처리
  async markAsRead(notificationId, userId) {
    try {
      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, userId },
        { isRead: true },
        { new: true }
      );

      if (!notification) {
        throw new Error('Notification not found or unauthorized');
      }

      return notification;
    } catch (error) {
      throw new Error(`Failed to mark notification as read: ${error.message}`);
    }
  }

  // 모든 알림 읽음 처리
  async markAllAsRead(userId) {
    try {
      await Notification.updateMany(
        { userId, isRead: false },
        { isRead: true }
      );
    } catch (error) {
      throw new Error(`Failed to mark all notifications as read: ${error.message}`);
    }
  }

  // 알림 삭제
  async deleteNotification(notificationId, userId) {
    try {
      const notification = await Notification.findOneAndDelete({
        _id: notificationId,
        userId
      });

      if (!notification) {
        throw new Error('Notification not found or unauthorized');
      }

      return notification;
    } catch (error) {
      throw new Error(`Failed to delete notification: ${error.message}`);
    }
  }
}

module.exports = new NotificationService();