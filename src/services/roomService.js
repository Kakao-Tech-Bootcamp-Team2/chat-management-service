const Room = require('../models/Room');

class RoomService {
  // 채팅방 생성
  async createRoom(roomData, creatorId) {
    try {
      const room = new Room({
        ...roomData,
        participants: [{
          userId: creatorId,
          role: 'admin'
        }]
      });
      
      return await room.save();
    } catch (error) {
      throw new Error(`Failed to create room: ${error.message}`);
    }
  }

  // 채팅방 조회
  async getRoom(roomId) {
    try {
      const room = await Room.findById(roomId);
      if (!room) {
        throw new Error('Room not found');
      }
      return room;
    } catch (error) {
      throw new Error(`Failed to get room: ${error.message}`);
    }
  }

  // 사용자의 채팅방 목록 조회
  async getRoomsByUserId(userId) {
    try {
      return await Room.find({
        'participants.userId': userId
      }).sort({ updatedAt: -1 });
    } catch (error) {
      throw new Error(`Failed to get user rooms: ${error.message}`);
    }
  }

  // 채팅방 정보 수정
  async updateRoom(roomId, updateData, userId) {
    try {
      const room = await Room.findById(roomId);
      if (!room) {
        throw new Error('Room not found');
      }

      // 관리자 권한 확인
      const isAdmin = room.participants.some(p => 
        p.userId === userId && p.role === 'admin'
      );
      if (!isAdmin) {
        throw new Error('Unauthorized: Only admin can update room');
      }

      return await Room.findByIdAndUpdate(roomId, updateData, { new: true });
    } catch (error) {
      throw new Error(`Failed to update room: ${error.message}`);
    }
  }

  // 채팅방 참여자 추가
  async addParticipant(roomId, userId) {
    try {
      const room = await Room.findById(roomId);
      if (!room) {
        throw new Error('Room not found');
      }

      if (room.participants.some(p => p.userId === userId)) {
        throw new Error('User is already a participant');
      }

      room.participants.push({
        userId,
        role: 'member'
      });

      return await room.save();
    } catch (error) {
      throw new Error(`Failed to add participant: ${error.message}`);
    }
  }

  // 채팅방 참여자 제거
  async removeParticipant(roomId, userId, requesterId) {
    try {
      const room = await Room.findById(roomId);
      if (!room) {
        throw new Error('Room not found');
      }

      // 관리자 권한 확인 또는 자신을 제거하는 경우
      const isAdmin = room.participants.some(p => 
        p.userId === requesterId && p.role === 'admin'
      );
      if (!isAdmin && requesterId !== userId) {
        throw new Error('Unauthorized: Cannot remove other participants');
      }

      room.participants = room.participants.filter(p => p.userId !== userId);
      return await room.save();
    } catch (error) {
      throw new Error(`Failed to remove participant: ${error.message}`);
    }
  }

  // AI 참여자 추가/설정
  async configureAI(roomId, aiType, settings, userId) {
    try {
      const room = await Room.findById(roomId);
      if (!room) {
        throw new Error('Room not found');
      }

      // 관리자 권한 확인
      const isAdmin = room.participants.some(p => 
        p.userId === userId && p.role === 'admin'
      );
      if (!isAdmin) {
        throw new Error('Unauthorized: Only admin can configure AI');
      }

      // AI 설정 업데이트
      const aiIndex = room.aiParticipants.findIndex(ai => ai.type === aiType);
      if (aiIndex >= 0) {
        room.aiParticipants[aiIndex].settings = new Map(Object.entries(settings));
      } else {
        room.aiParticipants.push({
          type: aiType,
          settings: new Map(Object.entries(settings))
        });
      }

      return await room.save();
    } catch (error) {
      throw new Error(`Failed to configure AI: ${error.message}`);
    }
  }
}

module.exports = new RoomService();