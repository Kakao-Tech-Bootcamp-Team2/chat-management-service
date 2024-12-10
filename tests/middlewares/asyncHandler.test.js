const asyncHandler = require('../../src/middlewares/asyncHandler');

describe('asyncHandler', () => {
  it('should handle successful async operations', async () => {
    const mockReq = {};
    const mockRes = {};
    const mockNext = jest.fn();

    const handler = asyncHandler(async (req, res) => {
      return 'success';
    });

    await handler(mockReq, mockRes, mockNext);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should handle errors in async operations', async () => {
    const mockReq = {};
    const mockRes = {};
    const mockNext = jest.fn();
    const mockError = new Error('Test error');

    const handler = asyncHandler(async (req, res) => {
      throw mockError;
    });

    await handler(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledWith(mockError);
  });

  it('should handle non-async functions', async () => {
    const mockReq = {};
    const mockRes = {};
    const mockNext = jest.fn();

    const handler = asyncHandler((req, res) => {
      return 'success';
    });

    await handler(mockReq, mockRes, mockNext);
    expect(mockNext).not.toHaveBeenCalled();
  });
}); 