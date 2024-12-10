const NotificationController = require('../../src/controllers/notificationController');
const NotificationService = require('../../src/services/notificationService');

// NotificationService의 모든 메서드를 모킹
jest.mock('../../src/services/notificationService', () => ({
  getUserNotifications: jest.fn(),
  getUnreadCount: jest.fn(),
  markAsRead: jest.fn(),
  markAllAsRead: jest.fn(),
  updateSettings: jest.fn(),
  getSubscriptionStatus: jest.fn(),
  deleteNotification: jest.fn()
}));

describe('NotificationController', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      user: { id: 'user123' },
      params: { notificationId: 'notif123' },
      query: { limit: 20, offset: 0 }
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('getNotifications', () => {
    it('should get notifications successfully', async () => {
      const mockNotifications = [{ id: 'notif123', content: 'Test notification' }];
      NotificationService.getUserNotifications.mockResolvedValue(mockNotifications);
      NotificationService.getUnreadCount.mockResolvedValue(5);

      await NotificationController.getNotifications(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: {
          notifications: mockNotifications,
          hasMore: false,
          totalUnread: 5
        }
      });
    });

    it('should handle errors', async () => {
      NotificationService.getUserNotifications.mockRejectedValue(new Error('Service error'));

      await NotificationController.getNotifications(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Service error'
      });
    });
  });

  describe('markAsRead', () => {
    it('should mark notification as read successfully', async () => {
      const mockNotification = { id: 'notif123', isRead: true };
      NotificationService.markAsRead.mockResolvedValue(mockNotification);
      NotificationService.getUnreadCount.mockResolvedValue(4);

      await NotificationController.markAsRead(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: {
          notification: mockNotification,
          totalUnread: 4
        }
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
        data: {
          totalUnread: 0,
          message: '모든 알림이 읽음 처리되었습니다.'
        }
      });
    });
  });

  describe('updateSettings', () => {
    it('should update notification settings successfully', async () => {
      const mockSettings = { email: true, push: false };
      NotificationService.updateSettings.mockResolvedValue(mockSettings);

      mockReq.body = { settings: mockSettings };

      await NotificationController.updateSettings(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: {
          settings: mockSettings
        }
      });
    });
  });

  describe('getSubscriptionStatus', () => {
    it('should get subscription status successfully', async () => {
      const mockStatus = { subscribed: true };
      NotificationService.getSubscriptionStatus.mockResolvedValue(mockStatus);

      await NotificationController.getSubscriptionStatus(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: {
          status: mockStatus
        }
      });
    });
  });
}); 