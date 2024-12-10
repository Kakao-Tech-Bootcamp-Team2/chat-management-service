class AIService {
    constructor() {
      this.aiTypes = ['wayneAI', 'consultingAI'];
    }
  
    // AI 응답 생성
    async generateResponse(aiType, message, context) {
      try {
        // AI 타입 검증
        if (!this.aiTypes.includes(aiType)) {
          throw new Error('Invalid AI type');
        }
  
        // 실제 AI 응답 생성 로직은 Chat Service에서 처리
        // 여기서는 AI 설정과 관련된 부분만 처리
        return {
          aiType,
          settings: this.getAISettings(aiType),
          context
        };
      } catch (error) {
        throw new Error(`Failed to generate AI response: ${error.message}`);
      }
    }
  
    // AI 설정 가져오기
    getAISettings(aiType) {
      // AI 타입별 기본 설정 반환
      const settings = {
        wayneAI: {
          temperature: 0.7,
          maxTokens: 150
        },
        consultingAI: {
          temperature: 0.5,
          maxTokens: 300
        }
      };
  
      return settings[aiType] || {};
    }
  }
  
  module.exports = new AIService();