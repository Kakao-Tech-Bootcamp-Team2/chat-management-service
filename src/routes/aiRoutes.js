const express = require('express');
const router = express.Router();
const AIController = require('../controllers/aiController');
const { validateRequest } = require('../middlewares/validator');
const auth = require('../middlewares/auth');

// AI 설정 조회
router.get('/:aiType/settings', 
  auth,
  validateRequest({
    params: {
      aiType: { type: 'string', required: true }
    }
  }),
  AIController.getAISettings
);

// AI 응답 생성
router.post('/:aiType/generate',
  auth,
  validateRequest({
    params: {
      aiType: { type: 'string', required: true }
    },
    body: {
      message: { type: 'string', required: true },
      context: { type: 'object', required: false }
    }
  }),
  AIController.generateResponse
);

// AI 컨텍스트 초기화
router.post('/:aiType/clear-context',
  auth,
  validateRequest({
    params: {
      aiType: { type: 'string', required: true }
    },
    body: {
      roomId: { type: 'string', required: true }
    }
  }),
  AIController.clearContext
);

// AI 시스템 프롬프트 업데이트
router.put('/:aiType/system-prompt',
  auth,
  validateRequest({
    params: {
      aiType: { type: 'string', required: true }
    },
    body: {
      prompt: { type: 'string', required: true },
      roomId: { type: 'string', required: true }
    }
  }),
  AIController.updateSystemPrompt
);

module.exports = router;