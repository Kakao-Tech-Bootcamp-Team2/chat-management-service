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

// AI 응답 생성 설정
router.post('/:aiType/prepare',
  validateRequest({
    params: {
      aiType: { type: 'string', enum: ['wayneAI', 'consultingAI'] }
    },
    body: {
      message: { type: 'string', required: true },
      context: { type: 'object', required: false }
    }
  }),
  AIController.prepareAIResponse
);

module.exports = router;