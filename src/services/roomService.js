const Room = require('../models/Room');
const { createLogger } = require('../utils/logger');
const logger = createLogger('RoomService');

class RoomService {
  async createRoom(roomData) {
    try {
      const room = new Room({
        name: roomData.name,
        participants: roomData.participants
      });

      return await room.save();
    } catch (error) {
      logger.error('Room creation failed:', error);
      throw error;
    }
  }

  // 채팅방 목록 조회
  async getRooms(userId, { page = 1, limit = 20, search = '' }) {
    try {
      const query = {
        'participants.userId': userId
      };

      if (search) {
        query.name = { $regex: search, $options: 'i' };
      }

      const [rooms, total] = await Promise.all([
        Room.find(query)
          .sort({ updatedAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit),
        Room.countDocuments(query)
      ]);

      return {
        rooms,
        total,
        page,
        pages: Math.ceil(total / limit)
      };
    } catch (error) {
      logger.error('Get rooms failed:', error);
      throw error;
    }
  }

  // 특정 채팅방 조회
  async getRoom(roomId, userId) {
    try {
      const room = await Room.findOne({
        _id: roomId,
        'participants.userId': userId
      });

      if (!room) {
        throw new Error('Room not found or unauthorized');
      }

      return room;
    } catch (error) {
      logger.error('Get room failed:', error);
      throw error;
    }
  }

  // 채팅방 정보 수정
  async updateRoom(roomId, updates, userId) {
    try {
      const room = await Room.findOne({
        _id: roomId,
        'participants.userId': userId,
        'participants.role': { $in: ['owner', 'admin'] }
      });

      if (!room) {
        throw new Error('Room not found or unauthorized');
      }

      Object.assign(room, updates);
      return await room.save();
    } catch (error) {
      logger.error('Update room failed:', error);
      throw error;
    }
  }

  // 초대 코드 생성
  async generateInviteCode(roomId, userId) {
    try {
      const room = await this.getRoom(roomId, userId);
      const code = Math.random().toString(36).substring(2, 15);
      
      room.inviteCodes.push({
        code,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24시간 후 만료
        createdBy: userId
      });

      await room.save();
      return code;
    } catch (error) {
      logger.error('Generate invite code failed:', error);
      throw error;
    }
  }

  // 채팅방 참여
  async joinRoom(roomId, sessionId, password) {
    try {
      logger.debug('채팅방 입장 시도:', {
        roomId,
        sessionId,
        hasPassword: !!password
      });

      // 채팅방 조회 (비밀번호 필드 포함)
      const room = await Room.findById(roomId).select('+password');
      
      if (!room) {
        const error = new Error('존재하지 않는 채팅방입니다.');
        error.status = 404;
        throw error;
      }

      logger.debug('채팅방 조회 성공:', {
        roomId,
        roomName: room.name,
        isPrivate: room.isPrivate,
        participantsCount: room.participants.length
      });

      // 이미 참여 중인지 확인 (owner는 제외)
      const participant = room.participants.find(p => p.userId === sessionId);
      if (participant) {
        if (participant.role === 'owner') {
          return room; // 방장은 바로 리턴
        }
        logger.debug('이미 참여 중인 사용자:', {
          roomId,
          sessionId,
          role: participant.role
        });
        const error = new Error('이미 참여 중인 채팅방입니다.');
        error.status = 400;
        throw error;
      }

      // 비밀번호 확인
      if (room.isPrivate) {
        if (!password) {
          const error = new Error('비밀번호가 필요합니다.');
          error.status = 400;
          throw error;
        }
        
        if (password !== room.password) {
          logger.debug('비밀번호 불일치:', {
            roomId,
            sessionId
          });
          const error = new Error('비밀번호가 일치하지 않습니다.');
          error.status = 401;
          throw error;
        }
      }

      // 참여자 추가
      room.participants.push({
        userId: sessionId,
        role: 'member'
      });

      await room.save();
      
      logger.info('채팅방 입장 성공:', {
        roomId,
        roomName: room.name,
        sessionId,
        participantsCount: room.participants.length
      });

      return room;
    } catch (error) {
      logger.error('채팅방 입장 실패:', {
        error: error.message,
        status: error.status,
        roomId,
        sessionId
      });
      throw error;
    }
  }

  // 채팅방 AI 설정 조회
  async getAISettings(roomId, userId) {
    try {
      const room = await this.getRoom(roomId, userId);
      return room.aiSettings || { enabled: false };
    } catch (error) {
      logger.error('Get AI settings failed:', error);
      throw error;
    }
  }
}

module.exports = new RoomService();