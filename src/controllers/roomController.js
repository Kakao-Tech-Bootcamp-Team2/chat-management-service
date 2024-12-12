const RoomService = require("../services/roomService");
const { createLogger } = require("../utils/logger");
const logger = createLogger("RoomController");

class RoomController {
  async createRoom(req, res, next) {
    try {
      const { name: roomName, password } = req.body;
      const sessionId = req.header("x-session-id");
      const { email, name: username } = req.user;

      if (!roomName || !sessionId) {
        return res.status(400).json({
          success: false,
          error: {
            message: "채팅방 이름과 세션 ID가 필요합니다.",
          },
        });
      }

      const roomData = {
        name: roomName,
        isPrivate: !!password,
        password,
        participants: [
          {
            name: username,
            userId: sessionId,
            email: email,
            role: "owner",
          },
        ],
      };

      const room = await RoomService.createRoom(roomData);

      return res.status(201).json({
        success: true,
        data: room,
      });
    } catch (error) {
      logger.error("채팅방 생성 실패:", {
        error: error.message,
        sessionId: req.header("x-session-id"),
        email: req.user.email,
        body: req.body,
      });

      return res.status(500).json({
        success: false,
        error: {
          message: "채팅방 생성에 실패했습니다.",
        },
      });
    }
  }

  // 채팅방 목록 조회
  async getRooms(req, res) {
    try {
      const {
        page = 0,
        pageSize = 20,
        sortField,
        sortOrder,
        search,
      } = req.query;
      const userId = req.user.id;

      // 캐시 컨트롤 헤더 추가
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");

      logger.debug("Room list request:", {
        userId,
        page,
        pageSize,
        sortField,
        sortOrder,
        search,
      });

      const result = await RoomService.getRooms(userId, {
        page,
        pageSize,
        sortField,
        sortOrder,
        search,
      });

      logger.debug("Room list response:", result);

      res.status(200).json({
        success: true,
        data: result.data,
        metadata: result.metadata,
      });
    } catch (error) {
      logger.error("Get rooms failed:", error);
      res.status(500).json({
        success: false,
        error: error.message || "채팅방 목록을 불러오는데 실패했습니다.",
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
        data: room,
      });
    } catch (error) {
      logger.error("Get room failed:", error);
      res.status(500).json({
        success: false,
        error: error.message || "채팅방 정보를 불러오는데 실패했습니다.",
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
        data: updatedRoom,
      });
    } catch (error) {
      logger.error("Room update failed:", error);
      res.status(500).json({
        success: false,
        error: error.message || "채팅방 정보 수정에 실패했습니다.",
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
        message: "참여자가 추가되었습니다.",
      });
    } catch (error) {
      logger.error("Add participant failed:", error);
      res.status(500).json({
        success: false,
        error: error.message || "참여자 추가에 실패했습니다.",
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
        message: "참여자가 제거되었습니다.",
      });
    } catch (error) {
      logger.error("Remove participant failed:", error);
      res.status(500).json({
        success: false,
        error: error.message || "참여자 제거에 실패했습니다.",
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
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24시 후 만료
        },
      });
    } catch (error) {
      logger.error("Generate invite code failed:", error);
      res.status(500).json({
        success: false,
        error: error.message || "초대 코드 생성에 실패했습니다.",
      });
    }
  }

  // 채팅방 참여
  async joinRoom(req, res) {
    try {
      const { roomId } = req.params;
      const { password } = req.body;
      const sessionId = req.header("x-session-id");
      const { email, name: username } = req.user;

      if (!sessionId) {
        return res.status(400).json({
          success: false,
          error: {
            message: "세션 ID가 필요합니다.",
          },
        });
      }

      await RoomService.joinRoom(roomId, sessionId, username, email, password);

      return res.status(200).json({
        success: true,
        message: "채팅방에 참여했습니다.",
      });
    } catch (error) {
      logger.error("채팅방 입장 실패:", {
        error: error.message,
        sessionId: req.header("x-session-id"),
        email: req.user.email,
        roomId: req.params.roomId,
      });

      return res.status(error.status || 500).json({
        success: false,
        error: {
          message: error.message || "채팅방 참여에 실패했습니다.",
        },
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
        data: settings,
      });
    } catch (error) {
      logger.error("Get AI settings failed:", error);
      res.status(500).json({
        success: false,
        error: error.message || "AI 설정을 불러오는데 실패했습니다.",
      });
    }
  }
}

module.exports = new RoomController();
