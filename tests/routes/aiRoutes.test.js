const request = require('supertest');
const express = require('express');
const aiRoutes = require('../../src/routes/aiRoutes');
const AIController = require('../../src/controllers/aiController');

// OpenAI 모킹
jest.mock('openai', () => {
  class MockOpenAI {
    constructor(config) {
      this.apiKey = config.apiKey;
      this.chat = {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [{ message: { content: 'AI response' } }]
          })
        }
      };
    }
  }

  return { OpenAI: MockOpenAI };
});

jest.mock('../../src/controllers/aiController', () => ({
  prepareAIResponse: jest.fn(),
  getAISettings: jest.fn()
}));

const app = express();
app.use(express.json());
app.use('/api/ai', aiRoutes);

describe('AI Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/ai/:aiType/prepare', () => {
    it('should route to prepareAIResponse controller', async () => {
      const mockResponse = {
        success: true,
        data: { response: 'AI response' }
      };

      AIController.prepareAIResponse.mockImplementation((req, res) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .post('/api/ai/wayneAI/prepare')
        .send({ message: 'Test message' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
      expect(AIController.prepareAIResponse).toHaveBeenCalled();
    });
  });
});