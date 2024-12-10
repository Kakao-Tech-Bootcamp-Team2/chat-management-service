// services/aiService.js
const OpenAI = require('openai');
const { createLogger } = require('../utils/logger');
const logger = createLogger('AIService');

class AIService {
  constructor() {
    this.aiTypes = ['wayneAI', 'consultingAI'];
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  // AI 응답 생성
  async generateResponse(aiType, message, context = []) {
    try {
      if (!this.aiTypes.includes(aiType)) {
        throw new Error('Invalid AI type');
      }

      const settings = this.getAISettings(aiType);
      const systemPrompt = this.getSystemPrompt(aiType);
      
      // 대화 컨텍스트 구성
      const messages = [
        { role: 'system', content: systemPrompt },
        ...context,
        { role: 'user', content: message }
      ];

      // OpenAI API 호출
      const completion = await this.openai.chat.completions.create({
        model: settings.model,
        messages: messages,
        temperature: settings.temperature,
        max_tokens: settings.maxTokens,
        presence_penalty: settings.presencePenalty,
        frequency_penalty: settings.frequencyPenalty,
        stop: settings.stopSequences
      });

      const response = completion.choices[0].message.content;
      
      return {
        aiType,
        response,
        settings,
        usage: completion.usage,
        context: [...context, 
          { role: 'user', content: message },
          { role: 'assistant', content: response }
        ]
      };

    } catch (error) {
      logger.error('AI response generation failed:', error);
      throw new Error(`Failed to generate AI response: ${error.message}`);
    }
  }

  // AI 설정 가져오기
  getAISettings(aiType) {
    const settings = {
      wayneAI: {
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 150,
        presencePenalty: 0.6,
        frequencyPenalty: 0.5,
        stopSequences: ['\n\n', 'Human:', 'Assistant:'],
      },
      consultingAI: {
        model: 'gpt-4',
        temperature: 0.5,
        maxTokens: 300,
        presencePenalty: 0.3,
        frequencyPenalty: 0.3,
        stopSequences: ['\n\n', 'Human:', 'Assistant:'],
      }
    };

    return settings[aiType] || {};
  }

  // AI 유형별 시스템 프롬프트 가져오기
  getSystemPrompt(aiType) {
    const prompts = {
      wayneAI: `You are Wayne, a friendly and knowledgeable AI assistant. 
                You have expertise in various topics and can provide helpful insights.
                Always maintain a professional yet approachable tone.`,
      
      consultingAI: `You are a professional business consultant with expertise in 
                     strategy, management, and problem-solving. 
                     Provide clear, actionable advice and maintain a formal tone.`
    };

    return prompts[aiType] || '';
  }

  // 컨텍스트 유효성 검사 및 정리
  validateContext(context) {
    if (!Array.isArray(context)) return [];
    
    // 컨텍스트 크기 제한 (예: 최근 10개 메시지만 유지)
    const maxContextSize = 10;
    return context.slice(-maxContextSize).map(msg => ({
      role: msg.role || 'user',
      content: msg.content || ''
    }));
  }
}

module.exports = new AIService();