const ResponseFormatter = require('../../src/utils/responseFormatter');

describe('ResponseFormatter', () => {
  describe('success', () => {
    it('should format success response correctly', () => {
      const data = { id: 1, name: 'Test' };
      const response = ResponseFormatter.success(data, 'Success message');

      expect(response).toHaveProperty('success', true);
      expect(response).toHaveProperty('message', 'Success message');
      expect(response).toHaveProperty('data', data);
      expect(response).toHaveProperty('timestamp');
    });
  });

  describe('error', () => {
    it('should format error response correctly', () => {
      const errors = ['Error 1', 'Error 2'];
      const response = ResponseFormatter.error('Error occurred', errors, 400);

      expect(response).toHaveProperty('success', false);
      expect(response).toHaveProperty('message', 'Error occurred');
      expect(response).toHaveProperty('errors', errors);
      expect(response).toHaveProperty('statusCode', 400);
      expect(response).toHaveProperty('timestamp');
    });
  });
}); 