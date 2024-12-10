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

  // AI 응답 생성 및 스트리밍 처리
  async generateResponse(req, res) {
    try {
      const { aiType } = req.params;
      const { message, context, roomId } = req.body;
      const userId = req.user.id;

      logger.info('Generating AI response:', {
        aiType,
        roomId,
        userId,
        messageLength: message.length
      });

      // 스트리밍 응답 설정
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      // 스트리밍 시작 이벤트
      res.write('event: start\n');
      res.write(`data: ${JSON.stringify({ 
        aiType, 
        roomId,
        timestamp: new Date().toISOString()
      })}\n\n`);

      // AI 응답 생성 및 스트리밍
      const stream = await AIService.generateStreamResponse(aiType, message, context);
      
      stream.on('data', (chunk) => {
        res.write(`event: message\n`);
        res.write(`data: ${chunk}\n\n`);
      });

      stream.on('end', () => {
        res.write('event: end\n');
        res.write(`data: ${JSON.stringify({
          timestamp: new Date().toISOString()
        })}\n\n`);
        res.end();
      });

      stream.on('error', (error) => {
        logger.error('AI stream error:', error);
        res.write('event: error\n');
        res.write(`data: ${JSON.stringify({ 
          error: error.message,
          timestamp: new Date().toISOString()
        })}\n\n`);
        res.end();
      });

    } catch (error) {
      logger.error('AI response generation failed:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'AI 응답 생성에 실패했습니다.'
      });
    }
  }

  // AI 응답 중단
  async stopGeneration(req, res) {
    try {
      const { aiType } = req.params;
      const { roomId } = req.body;
      
      await AIService.stopGeneration(aiType, roomId);
      
      res.status(200).json({
        success: true,
        message: 'AI 응답 생성이 중단되었습니다.'
      });
    } catch (error) {
      logger.error('AI generation stop failed:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'AI 응답 중단에 실패했습니다.'
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
        message: 'AI 컨텍스트가 초기화되었습니다.'
      });
    } catch (error) {
      logger.error('AI context clear failed:', error);
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