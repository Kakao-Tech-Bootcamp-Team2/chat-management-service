const NotificationService = require('../../src/services/notificationService');
const Notification = require('../../src/models/Notification');
const mongoose = require('mongoose');

jest.mock('../../src/models/Notification');

describe('NotificationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createNotification', () => {
    it('should create a notification successfully', async () => {
      const validRoomId = new mongoose.Types.ObjectId();
      const notificationData = {
        userId: 'user123',
        type: 'mention',
        content: 'Test message',
        roomId: validRoomId,
        isRead: false
      };

      // Notification 생성자 모킹
      const mockNotification = {
        ...notificationData,
        _id: 'notif123',
        save: jest.fn().mockResolvedValue({
          ...notificationData,
          _id: 'notif123'
        })
      };

      Notification.mockImplementation(() => mockNotification);

      const result = await NotificationService.createNotification(
        notificationData.userId,
        notificationData.type,
        notificationData.content,
        notificationData.roomId
      );

      const expectedNotification = {
        ...notificationData,
        _id: 'notif123'
      };

      expect(result).toEqual(expectedNotification);
      expect(Notification).toHaveBeenCalledWith(expect.objectContaining({
        userId: notificationData.userId,
        type: notificationData.type,
        content: notificationData.content,
        roomId: notificationData.roomId
      }));
    });

    it('should throw error when validation fails', async () => {
      const validationError = new mongoose.Error.ValidationError();
      validationError.errors.type = new mongoose.Error.ValidatorError({
        message: 'Type is required'
      });

      const mockNotification = {
        save: jest.fn().mockRejectedValue(validationError)
      };

      Notification.mockImplementation(() => mockNotification);

      await expect(NotificationService.createNotification(
        'user123',
        undefined,
        'Test message',
        new mongoose.Types.ObjectId()
      )).rejects.toThrow('Failed to create notification');
    });
  });

  describe('markAsRead', () => {
    it('should mark notification as read', async () => {
      const updatedNotification = {
        _id: 'notif123',
        isRead: true
      };

      Notification.findOneAndUpdate = jest.fn().mockResolvedValue(updatedNotification);

      const result = await NotificationService.markAsRead('notif123', 'user123');
      expect(result.isRead).toBe(true);
    });

    it('should throw error if notification not found', async () => {
      Notification.findOneAndUpdate = jest.fn().mockResolvedValue(null);

      await expect(NotificationService.markAsRead('notif123', 'user123'))
        .rejects
        .toThrow('Notification not found or unauthorized');
    });
  });

  describe('getUserNotifications', () => {
    it('should get user notifications with limit', async () => {
      const mockNotifications = [
        { _id: 'notif1', content: 'Test 1' },
        { _id: 'notif2', content: 'Test 2' }
      ];

      Notification.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockNotifications)
      });

      const result = await NotificationService.getUserNotifications('user123', 5);
      expect(result).toEqual(mockNotifications);
    });
  });

  describe('deleteNotification', () => {
    it('should delete notification successfully', async () => {
      const mockNotification = {
        _id: 'notif123',
        userId: 'user123'
      };

      Notification.findOneAndDelete = jest.fn().mockResolvedValue(mockNotification);

      await NotificationService.deleteNotification('notif123', 'user123');
      expect(Notification.findOneAndDelete).toHaveBeenCalled();
    });

    it('should throw error if notification not found', async () => {
      Notification.findOneAndDelete = jest.fn().mockResolvedValue(null);

      await expect(NotificationService.deleteNotification('notif123', 'user123'))
        .rejects
        .toThrow('Notification not found or unauthorized');
    });
  });
}); 