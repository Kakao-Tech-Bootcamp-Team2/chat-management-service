const express = require('express');
const router = express.Router();
const RoomController = require('../controllers/roomController');
const { validateRequest } = require('../middlewares/validator');

// 채팅방 생성
router.post('/', 
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
router.get('/', RoomController.getRooms);

// 특정 채팅방 조회
router.get('/:roomId', RoomController.getRoom);

// 채팅방 정보 수정
router.patch('/:roomId',
  validateRequest({
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
  validateRequest({
    body: {
      userId: { type: 'string', required: true }
    }
  }),
  RoomController.addParticipant
);

// 채팅방 참여자 제거
router.delete('/:roomId/participants',
  validateRequest({
    body: {
      userId: { type: 'string', required: true }
    }
  }),
  RoomController.removeParticipant
);

module.exports = router;