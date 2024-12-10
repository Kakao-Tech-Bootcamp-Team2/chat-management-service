const { errorHandler, notFound } = require('../../src/middlewares/errorHandler');
const mongoose = require('mongoose');

describe('Error Handler Middleware', () => {
  let mockReq;
  let mockRes;
  let mockNext;
  let originalConsoleError;

  beforeEach(() => {
    // console.error 모킹
    originalConsoleError = console.error;
    console.error = jest.fn();

    mockReq = {
      originalUrl: '/test'
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    // console.error 복원
    console.error = originalConsoleError;
  });

  describe('errorHandler', () => {
    it('should handle mongoose ValidationError', () => {
      const validationError = new mongoose.Error.ValidationError();
      validationError.errors = {
        field: { message: 'Field is required' }
      };

      errorHandler(validationError, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: ['Field is required']
      });
    });

    it('should handle mongoose CastError', () => {
      const castError = new mongoose.Error.CastError('ObjectId', 'invalid-id', 'id');

      errorHandler(castError, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid ID format'
      });
    });

    it('should handle custom errors with statusCode', () => {
      const customError = new Error('Custom error');
      customError.statusCode = 403;

      errorHandler(customError, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Custom error'
      });
    });

    it('should handle unknown errors', () => {
      const unknownError = new Error('Unknown error');

      errorHandler(unknownError, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Internal Server Error'
      });
    });
  });

  describe('notFound', () => {
    it('should handle 404 errors', () => {
      notFound(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
      expect(mockNext.mock.calls[0][0].statusCode).toBe(404);
      expect(mockNext.mock.calls[0][0].message).toBe('Not Found - /test');
    });
  });
}); 