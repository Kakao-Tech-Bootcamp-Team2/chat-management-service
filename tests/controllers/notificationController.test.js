const NotificationController = require('../../src/controllers/notificationController');
const NotificationService = require('../../src/services/notificationService');

jest.mock('../../src/services/notificationService');

describe('NotificationController', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      user: { id: 'user123' },
      params: { notificationId: 'notif123' },
      query: { limit: 10 }
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('getNotifications', () => {
    it('should get notifications successfully', async () => {
      const mockNotifications = [{ id: 'notif123', content: 'Test notification' }];
      NotificationService.getUserNotifications.mockResolvedValue(mockNotifications);

      await NotificationController.getNotifications(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockNotifications
      });
    });
  });

  describe('markAsRead', () => {
    it('should mark notification as read successfully', async () => {
      const mockNotification = { id: 'notif123', isRead: true };
      NotificationService.markAsRead.mockResolvedValue(mockNotification);

      await NotificationController.markAsRead(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockNotification
      });
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all notifications as read', async () => {
      NotificationService.markAllAsRead.mockResolvedValue();

      await NotificationController.markAllAsRead(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'All notifications marked as read'
      });
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to mark all as read');
      NotificationService.markAllAsRead.mockRejectedValue(error);

      await NotificationController.markAllAsRead(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: error.message
      });
    });
  });

  describe('deleteNotification', () => {
    it('should delete notification successfully', async () => {
      NotificationService.deleteNotification.mockResolvedValue();

      await NotificationController.deleteNotification(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Notification deleted successfully'
      });
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to delete notification');
      NotificationService.deleteNotification.mockRejectedValue(error);

      await NotificationController.deleteNotification(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: error.message
      });
    });
  });
}); 