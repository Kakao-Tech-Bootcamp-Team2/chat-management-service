const AIService = require('../services/aiService');

class AIController {
  // AI 설정 조회
  async getAISettings(req, res) {
    try {
      const { aiType } = req.params;
      const settings = await AIService.getAISettings(aiType);

      res.status(200).json({
        success: true,
        data: settings
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  // AI 응답 생성 설정 전달
  async prepareAIResponse(req, res) {
    try {
      const { aiType } = req.params;
      const { message, context } = req.body;

      const response = await AIService.generateResponse(aiType, message, context);

      res.status(200).json({
        success: true,
        data: response
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new AIController();