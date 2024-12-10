const express = require('express');
const router = express.Router();
const AIController = require('../controllers/aiController');
const { validateRequest } = require('../middlewares/validator');

// AI 설정 조회
router.get('/:aiType/settings', 
  validateRequest({
    params: {
      aiType: { type: 'string', enum: ['wayneAI', 'consultingAI'] }
    }
  }),
  AIController.getAISettings
);

// AI 응답 생성
router.post('/:aiType/generate',
  validateRequest({
    params: {
      aiType: { type: 'string', enum: ['wayneAI', 'consultingAI'] }
    },
    body: {
      message: { type: 'string', required: true },
      context: { type: 'object', required: false },
      roomId: { type: 'string', required: false }
    }
  }),
  AIController.generateResponse
);

// AI 컨텍스트 초기화
router.post('/:aiType/clear-context',
  validateRequest({
    params: {
      aiType: { type: 'string', enum: ['wayneAI', 'consultingAI'] }
    },
    body: {
      roomId: { type: 'string', required: true }
    }
  }),
  AIController.clearContext
);

// AI 시스템 프롬프트 업데이트
router.put('/:aiType/system-prompt',
  validateRequest({
    params: {
      aiType: { type: 'string', enum: ['wayneAI', 'consultingAI'] }
    },
    body: {
      prompt: { type: 'string', required: true },
      roomId: { type: 'string', required: true }
    }
  }),
  AIController.updateSystemPrompt
);

module.exports = router;