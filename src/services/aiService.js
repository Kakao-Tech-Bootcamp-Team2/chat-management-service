// services/aiService.js
const OpenAI = require('openai');
const { createLogger } = require('../utils/logger');
const logger = createLogger('AIService');
const config = require('../config');

class AIService {
  constructor() {
    this.aiTypes = ['wayneAI', 'consultingAI'];
    
    if (process.env.NODE_ENV !== 'production') {
      logger.info('Using Mock AI Service for development');
      this.openai = this.createMockAIClient();
    } else {
      if (!config.ai.openai.apiKey) {
        throw new Error('OpenAI API key is required in production environment');
      }
      this.openai = new OpenAI({
        apiKey: config.ai.openai.apiKey
      });
    }
  }

  // AI 설정 조회
  async getAISettings(aiType) {
    try {
      const settings = {
        wayneAI: {
          model: 'gpt-4',
          temperature: config.ai.wayneAI.defaultTemperature,
          systemPrompt: config.ai.wayneAI.defaultPrompt
        },
        consultingAI: {
          model: 'gpt-4',
          temperature: config.ai.consultingAI.defaultTemperature,
          systemPrompt: config.ai.consultingAI.defaultPrompt
        }
      };

      return settings[aiType] || {};
    } catch (error) {
      logger.error('Failed to get AI settings:', error);
      throw error;
    }
  }

  // AI 응답 생성
  async generateResponse(aiType, message, context = []) {
    try {
      if (!this.aiTypes.includes(aiType)) {
        throw new Error('Invalid AI type');
      }

      const settings = await this.getAISettings(aiType);
      
      // 대화 컨텍스트 구성
      const messages = [
        { role: 'system', content: settings.systemPrompt },
        ...this.validateContext(context),
        { role: 'user', content: message }
      ];

      // OpenAI API 호출
      const completion = await this.openai.chat.completions.create({
        model: settings.model,
        messages: messages,
        temperature: settings.temperature
      });

      const response = completion.choices[0].message.content;
      
      return {
        aiType,
        response,
        context: [...context, 
          { role: 'user', content: message },
          { role: 'assistant', content: response }
        ]
      };
    } catch (error) {
      logger.error('AI response generation failed:', error);
      throw error;
    }
  }

  // 컨텍스트 유효성 검사 및 정리
  validateContext(context) {
    if (!Array.isArray(context)) return [];
    
    const maxContextSize = 10;
    return context.slice(-maxContextSize).map(msg => ({
      role: msg.role || 'user',
      content: msg.content || ''
    }));
  }

  // 개발 환경용 Mock AI 클라이언트
  createMockAIClient() {
    return {
      chat: {
        completions: {
          create: async (params) => {
            logger.info('Mock AI Response generated');
            return {
              choices: [{
                message: {
                  content: `Mock AI Response for: ${params.messages[params.messages.length - 1].content}\n\nThis is a development environment response.`
                }
              }]
            };
          }
        }
      }
    };
  }
}

module.exports = new AIService();