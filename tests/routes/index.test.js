const request = require('supertest');
const express = require('express');
const routes = require('../../src/routes');

const app = express();
app.use('/api', routes);

describe('API Routes', () => {
  describe('GET /api/health', () => {
    it('should return health check status', async () => {
      const response = await request(app)
        .get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });

  describe('Route mounting', () => {
    it('should mount room routes', () => {
      const routeStack = app._router.stack;
      const hasRoomRoutes = routeStack.some(layer => 
        layer.regexp.test('/api/rooms')
      );
      expect(hasRoomRoutes).toBe(true);
    });

    it('should mount AI routes', () => {
      const routeStack = app._router.stack;
      const hasAIRoutes = routeStack.some(layer => 
        layer.regexp.test('/api/ai')
      );
      expect(hasAIRoutes).toBe(true);
    });

    it('should mount notification routes', () => {
      const routeStack = app._router.stack;
      const hasNotificationRoutes = routeStack.some(layer => 
        layer.regexp.test('/api/notifications')
      );
      expect(hasNotificationRoutes).toBe(true);
    });
  });
}); 