const AIService = require('../../src/services/aiService');

describe('AIService', () => {
  describe('generateResponse', () => {
    it('should generate AI response successfully', async () => {
      const aiType = 'wayneAI';
      const message = 'Test message';
      const context = {};

      const result = await AIService.generateResponse(aiType, message, context);

      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
    });

    it('should throw error for invalid AI type', async () => {
      const aiType = 'invalidAI';
      const message = 'Test message';
      const context = {};

      await expect(AIService.generateResponse(aiType, message, context))
        .rejects.toThrow('Invalid AI type');
    });
  });
});