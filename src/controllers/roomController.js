const RoomService = require('../services/roomService');

class RoomController {
  // 채팅방 생성
  async createRoom(req, res) {
    try {
      const { name, description, isPrivate, password } = req.body;
      const userId = req.user.id;  // API Gateway에서 전달된 사용자 정보

      const room = await RoomService.createRoom({
        name,
        description,
        isPrivate,
        password
      }, userId);

      res.status(201).json({
        success: true,
        data: room
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  // 채팅방 목록 조회
  async getRooms(req, res) {
    try {
      const userId = req.user.id;
      const rooms = await RoomService.getRoomsByUserId(userId);

      res.status(200).json({
        success: true,
        data: rooms
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  // 특정 채팅방 조회
  async getRoom(req, res) {
    try {
      const { roomId } = req.params;
      const room = await RoomService.getRoom(roomId);

      res.status(200).json({
        success: true,
        data: room
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
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
        data: room
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  // 채팅방 참여자 추가
  async addParticipant(req, res) {
    try {
      const { roomId } = req.params;
      const { userId } = req.body;

      const room = await RoomService.addParticipant(roomId, userId);

      res.status(200).json({
        success: true,
        data: room
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
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
        data: room
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new RoomController();