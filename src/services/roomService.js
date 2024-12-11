const Room = require('../models/Room');
const { createLogger } = require('../utils/logger');
const logger = createLogger('RoomService');

class RoomService {
  // 채팅방 생성
  async createRoom(roomData) {
    try {
      const room = new Room({
        name: roomData.name,
        description: roomData.description,
        isPrivate: roomData.isPrivate,
        password: roomData.password,
        participants: [{
          userId: roomData.createdBy,
          role: 'owner'
        }],
        aiSettings: {
          enabled: false
        }
      });
      
      return await room.save();
    } catch (error) {
      logger.error('Create room failed:', error);
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
  async joinRoom(roomId, userId, { inviteCode, password }) {
    try {
      const room = await Room.findById(roomId);
      if (!room) {
        throw new Error('Room not found');
      }

      // 이미 참여 중인지 확인
      if (room.participants.some(p => p.userId === userId)) {
        throw new Error('Already joined');
      }

      // 초대 코드 또는 비밀번호 확인
      if (room.isPrivate) {
        if (inviteCode) {
          const validInvite = room.inviteCodes.find(i => 
            i.code === inviteCode && i.expiresAt > new Date()
          );
          if (!validInvite) {
            throw new Error('Invalid or expired invite code');
          }
        } else if (password !== room.password) {
          throw new Error('Invalid password');
        }
      }

      room.participants.push({
        userId,
        role: 'member'
      });

      return await room.save();
    } catch (error) {
      logger.error('Join room failed:', error);
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