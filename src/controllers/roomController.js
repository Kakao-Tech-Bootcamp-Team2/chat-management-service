const RoomService = require('../services/roomService');
const { createLogger } = require('../utils/logger');
const logger = createLogger('RoomController');

class RoomController {
  // 채팅방 생성
  async createRoom(req, res) {
    try {
      const { 
        name, 
        description, 
        isPrivate, 
        password,
        participants = [], 
        aiType 
      } = req.body;
      const userId = req.user.id;

      const room = await RoomService.createRoom({
        name,
        description,
        isPrivate,
        password,
        participants,
        aiType,
        createdBy: userId
      });

      res.status(201).json({
        success: true,
        data: {
          room,
          joinToken: room.isPrivate ? await RoomService.generateJoinToken(room._id) : null
        }
      });
    } catch (error) {
      logger.error('Failed to create room:', error);
      res.status(500).json({
        success: false,
        error: error.message || '채팅방 생성에 실패했습니다.'
      });
    }
  }

  // 채팅방 목록 조회
  async getRooms(req, res) {
    try {
      const userId = req.user.id;
      const { 
        limit = 20, 
        offset = 0, 
        search,
        filter = 'all',
        sortBy = 'lastActivity',
        sortOrder = 'desc'
      } = req.query;

      const { rooms, total } = await RoomService.getRoomsByUserId(
        userId,
        { limit, offset, search, filter, sortBy, sortOrder }
      );

      res.status(200).json({
        success: true,
        data: {
          rooms,
          total,
          hasMore: rooms.length === limit
        }
      });
    } catch (error) {
      logger.error('Failed to get rooms:', error);
      res.status(500).json({
        success: false,
        error: error.message || '채팅방 목록을 불러오는데 실패했습니다.'
      });
    }
  }

  // 특정 채팅방 조회
  async getRoom(req, res) {
    try {
      const { roomId } = req.params;
      const userId = req.user.id;

      const room = await RoomService.getRoom(roomId, userId);

      res.status(200).json({
        success: true,
        data: {
          room,
          isParticipant: room.participants.includes(userId),
          unreadCount: await RoomService.getUnreadCount(roomId, userId)
        }
      });
    } catch (error) {
      logger.error('Failed to get room:', error);
      res.status(500).json({
        success: false,
        error: error.message || '채팅방 정보를 불러오는데 실패했습니다.'
      });
    }
  }

  // 채팅방 정보 수정
  async updateRoom(req, res) {
    try {
      const { roomId } = req.params;
      const userId = req.user.id;
      const updateData = req.body;

      const room = await RoomService.updateRoom(roomId, updateData, userId);

      res.status(200).json({
        success: true,
        data: {
          room,
          message: '채팅방 정보가 업데이트되었습니다.'
        }
      });
    } catch (error) {
      logger.error('Failed to update room:', error);
      res.status(500).json({
        success: false,
        error: error.message || '채팅방 정보 수정에 실패했습니다.'
      });
    }
  }

  // 채팅방 참여자 추가
  async addParticipant(req, res) {
    try {
      const { roomId } = req.params;
      const { userId, token } = req.body;
      const requesterId = req.user.id;

      const room = await RoomService.addParticipant(roomId, userId, {
        requesterId,
        joinToken: token
      });

      res.status(200).json({
        success: true,
        data: {
          room,
          message: '참여자가 추가되었습니다.'
        }
      });
    } catch (error) {
      logger.error('Failed to add participant:', error);
      res.status(500).json({
        success: false,
        error: error.message || '참여자 추가에 실패했습니다.'
      });
    }
  }

  // 채팅방 참여자 제거
  async removeParticipant(req, res) {
    try {
      const { roomId } = req.params;
      const { userId } = req.body;
      const requesterId = req.user.id;

      const room = await RoomService.removeParticipant(roomId, userId, requesterId);

      res.status(200).json({
        success: true,
        data: {
          room,
          message: '참여자가 제거되었습니다.'
        }
      });
    } catch (error) {
      logger.error('Failed to remove participant:', error);
      res.status(500).json({
        success: false,
        error: error.message || '참여자 제거에 실패했습니다.'
      });
    }
  }

  // 채팅방 나가기
  async leaveRoom(req, res) {
    try {
      const { roomId } = req.params;
      const userId = req.user.id;

      await RoomService.leaveRoom(roomId, userId);

      res.status(200).json({
        success: true,
        data: {
          message: '채팅방을 나갔습니다.'
        }
      });
    } catch (error) {
      logger.error('Failed to leave room:', error);
      res.status(500).json({
        success: false,
        error: error.message || '채팅방 나가기에 실패했습니다.'
      });
    }
  }

  // 채팅방 초대 코드 생성
  async generateInviteCode(req, res) {
    try {
      const { roomId } = req.params;
      const userId = req.user.id;

      const inviteCode = await RoomService.generateInviteCode(roomId, userId);

      res.status(200).json({
        success: true,
        data: {
          inviteCode,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24시간 후 만료
        }
      });
    } catch (error) {
      logger.error('Failed to generate invite code:', error);
      res.status(500).json({
        success: false,
        error: error.message || '초대 코드 생성에 실패했습니다.'
      });
    }
  }
}

module.exports = new RoomController();