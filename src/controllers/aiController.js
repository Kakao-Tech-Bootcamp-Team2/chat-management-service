const AIService = require('../services/aiService');
const { createLogger } = require('../utils/logger');
const logger = createLogger('AIController');

class AIController {
  // AI 설정 조회
  async getAISettings(req, res) {
    try {
      const { aiType } = req.params;
      const settings = await AIService.getAISettings(aiType);
      
      res.status(200).json({
        success: true,
        data: {
          ...settings,
          aiType
        }
      });
    } catch (error) {
      logger.error('AI settings retrieval failed:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'AI 설정을 불러오는데 실패했습니다.'
      });
    }
  }

  // AI 응답 생성
  async generateResponse(req, res) {
    try {
      const { aiType } = req.params;
      const { message, context, roomId } = req.body;
      
      const response = await AIService.generateResponse(aiType, message, context);
      
      res.status(200).json({
        success: true,
        data: response
      });
    } catch (error) {
      logger.error('AI response generation failed:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'AI 응답 생성에 실패했습니다.'
      });
    }
  }

  // AI 컨텍스트 초기화
  async clearContext(req, res) {
    try {
      const { aiType } = req.params;
      const { roomId } = req.body;
      
      await AIService.clearContext(aiType, roomId);
      
      res.status(200).json({
        success: true,
        message: 'Context cleared successfully'
      });
    } catch (error) {
      logger.error('Context clear failed:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'AI 컨텍스트 초기화에 실패했습니다.'
      });
    }
  }

  // AI 시스템 프롬프트 업데이트
  async updateSystemPrompt(req, res) {
    try {
      const { aiType } = req.params;
      const { prompt, roomId } = req.body;
      
      const updatedPrompt = await AIService.updateSystemPrompt(aiType, roomId, prompt);
      
      res.status(200).json({
        success: true,
        data: {
          prompt: updatedPrompt,
          aiType,
          roomId
        }
      });
    } catch (error) {
      logger.error('System prompt update failed:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'AI 시스템 프롬프트 업데이트에 실패했습니다.'
      });
    }
  }
}

module.exports = new AIController();