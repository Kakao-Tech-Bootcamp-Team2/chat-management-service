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
        data: room
      });
    } catch (error) {
      logger.error('Room creation failed:', error);
      res.status(500).json({
        success: false,
        error: error.message || '채팅방 생성에 실패했습니다.'
      });
    }
  }

  // 채팅방 목록 조회
  async getRooms(req, res) {
    try {
      const { page = 1, limit = 20, search } = req.query;
      const userId = req.user.id;

      const rooms = await RoomService.getRooms(userId, {
        page: parseInt(page),
        limit: parseInt(limit),
        search
      });

      res.status(200).json({
        success: true,
        data: rooms
      });
    } catch (error) {
      logger.error('Get rooms failed:', error);
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
        data: room
      });
    } catch (error) {
      logger.error('Get room failed:', error);
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
      const updates = req.body;
      const userId = req.user.id;

      const updatedRoom = await RoomService.updateRoom(roomId, updates, userId);

      res.status(200).json({
        success: true,
        data: updatedRoom
      });
    } catch (error) {
      logger.error('Room update failed:', error);
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
      const { userId } = req.body;
      const requesterId = req.user.id;

      await RoomService.addParticipant(roomId, userId, requesterId);

      res.status(200).json({
        success: true,
        message: '참여자가 추가되었습니다.'
      });
    } catch (error) {
      logger.error('Add participant failed:', error);
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

      await RoomService.removeParticipant(roomId, userId, requesterId);

      res.status(200).json({
        success: true,
        message: '참여자가 제거되었습니다.'
      });
    } catch (error) {
      logger.error('Remove participant failed:', error);
      res.status(500).json({
        success: false,
        error: error.message || '참여자 제거에 실패했습니다.'
      });
    }
  }

  // 채대 코드 생성
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
      logger.error('Generate invite code failed:', error);
      res.status(500).json({
        success: false,
        error: error.message || '초대 코드 생성에 실패했습니다.'
      });
    }
  }

  // 채팅방 참여 (초대 코드 또는 비밀번호)
  async joinRoom(req, res) {
    try {
      const { roomId } = req.params;
      const { inviteCode, password } = req.body;
      const userId = req.user.id;

      await RoomService.joinRoom(roomId, userId, { inviteCode, password });

      res.status(200).json({
        success: true,
        message: '채팅방에 참여했습니다.'
      });
    } catch (error) {
      logger.error('Join room failed:', error);
      res.status(500).json({
        success: false,
        error: error.message || '채팅방 참여에 실패했습니다.'
      });
    }
  }

  // 채팅방 AI 설정 조회
  async getAISettings(req, res) {
    try {
      const { roomId } = req.params;
      const userId = req.user.id;

      const settings = await RoomService.getAISettings(roomId, userId);

      res.status(200).json({
        success: true,
        data: settings
      });
    } catch (error) {
      logger.error('Get AI settings failed:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'AI 설정을 불러오는데 실패했습니다.'
      });
    }
  }
}

module.exports = new RoomController();