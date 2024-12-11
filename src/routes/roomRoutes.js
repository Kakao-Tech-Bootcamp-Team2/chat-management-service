const express = require('express');
const router = express.Router();
const RoomController = require('../controllers/roomController');
const { validateRequest } = require('../middlewares/validator');
const auth = require('../middlewares/auth');

// 채팅방 생성
router.post('/', 
  auth,
  validateRequest({
    body: {
      name: { type: 'string', required: true },
      description: { type: 'string', required: false },
      isPrivate: { type: 'boolean', required: false },
      password: { type: 'string', required: false }
    }
  }),
  RoomController.createRoom
);

// 채팅방 목록 조회
router.get('/',
  auth,
  RoomController.getRooms
);

// 특정 채팅방 조회
router.get('/:roomId',
  auth,
  validateRequest({
    params: {
      roomId: { type: 'string', required: true }
    }
  }),
  RoomController.getRoom
);

// 채팅방 정보 수정
router.patch('/:roomId',
  auth,
  validateRequest({
    params: {
      roomId: { type: 'string', required: true }
    },
    body: {
      name: { type: 'string', required: false },
      description: { type: 'string', required: false },
      isPrivate: { type: 'boolean', required: false },
      password: { type: 'string', required: false }
    }
  }),
  RoomController.updateRoom
);

// 채팅방 참여자 추가
router.post('/:roomId/participants',
  auth,
  validateRequest({
    params: {
      roomId: { type: 'string', required: true }
    },
    body: {
      userId: { type: 'string', required: true }
    }
  }),
  RoomController.addParticipant
);

// 채팅방 참여자 제거
router.delete('/:roomId/participants',
  auth,
  validateRequest({
    params: {
      roomId: { type: 'string', required: true }
    },
    body: {
      userId: { type: 'string', required: true }
    }
  }),
  RoomController.removeParticipant
);

// 초대 코드 생성
router.post('/:roomId/invite',
  auth,
  validateRequest({
    params: {
      roomId: { type: 'string', required: true }
    }
  }),
  RoomController.generateInviteCode
);

// 채팅방 참여 (초대 코드 또는 비밀번호)
router.post('/:roomId/join',
  auth,
  validateRequest({
    params: {
      roomId: { type: 'string', required: true }
    },
    body: {
      inviteCode: { type: 'string', required: false },
      password: { type: 'string', required: false }
    }
  }),
  RoomController.joinRoom
);

// 채팅방 AI 설정 조회
router.get('/:roomId/ai-settings',
  auth,
  validateRequest({
    params: {
      roomId: { type: 'string', required: true }
    }
  }),
  RoomController.getAISettings
);

module.exports = router;