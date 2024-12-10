const AIController = require('../../src/controllers/aiController');
const AIService = require('../../src/services/aiService');

jest.mock('../../src/services/aiService');

describe('AIController', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      params: { aiType: 'wayneAI' },
      body: {
        message: 'Test message',
        context: {}
      }
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('prepareAIResponse', () => {
    it('should prepare AI response successfully', async () => {
      const mockResponse = { response: 'AI response' };
      AIService.generateResponse.mockResolvedValue(mockResponse);

      await AIController.prepareAIResponse(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockResponse
      });
    });

    it('should handle errors properly', async () => {
      AIService.generateResponse.mockRejectedValue(new Error('Service error'));

      await AIController.prepareAIResponse(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Service error'
      });
    });
  });
});