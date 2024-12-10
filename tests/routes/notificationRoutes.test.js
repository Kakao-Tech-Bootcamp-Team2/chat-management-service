const request = require('supertest');
const express = require('express');
const notificationRoutes = require('../../src/routes/notificationRoutes');
const NotificationController = require('../../src/controllers/notificationController');

jest.mock('../../src/controllers/notificationController');
jest.mock('../../src/middlewares/validator', () => ({
  validateRequest: () => (req, res, next) => next()
}));

const app = express();
app.use(express.json());
app.use('/api/notifications', notificationRoutes);

describe('Notification Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /', () => {
    it('should get notifications with valid parameters', async () => {
      const mockNotifications = [
        { id: 'notif123', content: 'Test notification' }
      ];

      NotificationController.getNotifications.mockImplementation((req, res) => {
        res.status(200).json({
          success: true,
          data: mockNotifications
        });
      });

      const response = await request(app)
        .get('/api/notifications')
        .query({ limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: mockNotifications
      });
      expect(NotificationController.getNotifications).toHaveBeenCalled();
    });

    it('should work without limit parameter', async () => {
      const mockNotifications = [
        { id: 'notif123', content: 'Test notification' }
      ];

      NotificationController.getNotifications.mockImplementation((req, res) => {
        res.status(200).json({
          success: true,
          data: mockNotifications
        });
      });

      const response = await request(app)
        .get('/api/notifications');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: mockNotifications
      });
    });
  });

  describe('PATCH /:notificationId/read', () => {
    it('should mark notification as read', async () => {
      const notificationId = 'notif123';
      const mockResponse = {
        success: true,
        data: { id: notificationId, isRead: true }
      };

      NotificationController.markAsRead.mockImplementation((req, res) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .patch(`/api/notifications/${notificationId}/read`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
      expect(NotificationController.markAsRead).toHaveBeenCalled();
    });
  });

  describe('PATCH /read-all', () => {
    it('should mark all notifications as read', async () => {
      const mockResponse = {
        success: true,
        message: 'All notifications marked as read'
      };

      NotificationController.markAllAsRead.mockImplementation((req, res) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .patch('/api/notifications/read-all');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
      expect(NotificationController.markAllAsRead).toHaveBeenCalled();
    });
  });

  describe('DELETE /:notificationId', () => {
    it('should delete notification', async () => {
      const notificationId = 'notif123';
      const mockResponse = {
        success: true,
        message: 'Notification deleted successfully'
      };

      NotificationController.deleteNotification.mockImplementation((req, res) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .delete(`/api/notifications/${notificationId}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
      expect(NotificationController.deleteNotification).toHaveBeenCalled();
    });
  });
}); 