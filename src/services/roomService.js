const Room = require("../models/Room");
const { createLogger } = require("../utils/logger");
const logger = createLogger("RoomService");

class RoomService {
  async createRoom(roomData) {
    try {
      const room = new Room({
        name: roomData.name,
        participants: roomData.participants,
      });

      return await room.save();
    } catch (error) {
      logger.error("Room creation failed:", error);
      throw error;
    }
  }

  // 채팅방 목록 조회
  async getRooms(
    userId,
    {
      page = 0,
      pageSize = 20,
      sortField = "updatedAt",
      sortOrder = "desc",
      search = "",
    }
  ) {
    try {
      // 페이지와 pageSize 값의 유효성 검사
      const validPage = Math.max(0, parseInt(page));
      const validPageSize = Math.min(Math.max(1, parseInt(pageSize)), 100);

      // 모든 채팅방을 조회하도록 수정 (participants.userId 조건 제거)
      const query = {};

      if (search) {
        query.name = { $regex: search, $options: "i" };
      }

      // 정렬 설정
      const sort = {};
      sort[sortField] = sortOrder === "desc" ? -1 : 1;

      const skip = validPage * validPageSize;

      logger.debug("Pagination values:", {
        page: validPage,
        pageSize: validPageSize,
        skip,
        sortField,
        sortOrder,
        search,
      });

      // 전체 개수와 현재 페이지 데이터를 동시에 조회
      const [rooms, total] = await Promise.all([
        Room.find(query)
          .sort(sort)
          .skip(skip)
          .limit(validPageSize + 1),
        Room.countDocuments(query),
      ]);

      // hasMore 계산을 위해 limit+1개를 조회했으므로, 실제 반환할 데이터는 limit개까지만
      const hasMore = rooms.length > validPageSize;
      const paginatedRooms = rooms.slice(0, validPageSize);

      return {
        data: paginatedRooms,
        metadata: {
          total,
          page: validPage,
          pageSize: validPageSize,
          hasMore,
        },
      };
    } catch (error) {
      logger.error("Get rooms failed:", error);
      throw error;
    }
  }

  // 특정 채팅방 조회
  async getRoom(roomId, userId) {
    try {
      const room = await Room.findOne({
        _id: roomId,
        "participants.userId": userId,
      });

      if (!room) {
        throw new Error("Room not found or unauthorized");
      }

      return room;
    } catch (error) {
      logger.error("Get room failed:", error);
      throw error;
    }
  }

  // 채팅방 정보 수정
  async updateRoom(roomId, updates, userId) {
    try {
      const room = await Room.findOne({
        _id: roomId,
        "participants.userId": userId,
        "participants.role": { $in: ["owner", "admin"] },
      });

      if (!room) {
        throw new Error("Room not found or unauthorized");
      }

      Object.assign(room, updates);
      return await room.save();
    } catch (error) {
      logger.error("Update room failed:", error);
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
        createdBy: userId,
      });

      await room.save();
      return code;
    } catch (error) {
      logger.error("Generate invite code failed:", error);
      throw error;
    }
  }

  // 채팅방 참여
  async joinRoom(roomId, sessionId, username, email, password) {
    try {
      logger.debug("채팅방 입장 시도:", {
        roomId,
        sessionId,
        username,
        email,
        hasPassword: !!password,
      });

      // 채팅방 조회 (비밀번호 필드 포함)
      const room = await Room.findById(roomId).select("+password");

      if (!room) {
        const error = new Error("존재하지 않는 채팅방입니다.");
        error.status = 404;
        throw error;
      }

      // 이미 참여 중인지 확인
      const participant = room.participants.find((p) => p.userId === sessionId);
      if (participant) {
        logger.debug("이미 참여 중인 사용자:", {
          roomId,
          sessionId,
          username,
          email,
          role: participant.role,
        });
        return room;
      }

      // 비밀번호 확인 (새로운 참여자인 경우에만)
      if (room.isPrivate) {
        if (!password) {
          const error = new Error("비밀번호가 필요합니다.");
          error.status = 400;
          throw error;
        }

        if (password !== room.password) {
          logger.debug("비밀번호 불일치:", {
            roomId,
            sessionId,
          });
          const error = new Error("비밀번호가 일치하지 않습니다.");
          error.status = 401;
          throw error;
        }
      }

      // 새로운 참여자 추가
      room.participants.push({
        userId: sessionId,
        name: username,
        email: email,
        role: "member",
      });

      await room.save();

      logger.info("채팅방 입장 성공:", {
        roomId,
        roomName: room.name,
        sessionId,
        username,
        email,
        participantsCount: room.participants.length,
      });

      return room;
    } catch (error) {
      logger.error("채팅방 입장 실패:", {
        error: error.message,
        status: error.status,
        roomId,
        sessionId,
        username,
        email,
      });
      throw error;
    }
  }

  // 채팅방 AI 정 조
  async getAISettings(roomId, userId) {
    try {
      const room = await this.getRoom(roomId, userId);
      return room.aiSettings || { enabled: false };
    } catch (error) {
      logger.error("Get AI settings failed:", error);
      throw error;
    }
  }
}

module.exports = new RoomService();
