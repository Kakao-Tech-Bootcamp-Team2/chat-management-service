const RoomController = require('../../src/controllers/roomController');
const RoomService = require('../../src/services/roomService');

jest.mock('../../src/services/roomService', () => ({
  createRoom: jest.fn(),
  generateJoinToken: jest.fn(),
  getRoomsByUserId: jest.fn(),
  getRoom: jest.fn(),
  getUnreadCount: jest.fn(),
  generateInviteCode: jest.fn(),
  updateRoom: jest.fn(),
  addParticipant: jest.fn(),
  removeParticipant: jest.fn()
}));

describe('RoomController', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      user: { id: 'user123' },
      body: {},
      params: {},
      query: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('createRoom', () => {
    it('should create room successfully', async () => {
      const roomData = {
        name: 'Test Room',
        description: 'Test Description',
        isPrivate: false
      };
      const mockRoom = { ...roomData, _id: 'room123' };
      
      mockReq.body = roomData;
      RoomService.createRoom.mockResolvedValue(mockRoom);
      RoomService.generateJoinToken.mockResolvedValue('token123');

      await RoomController.createRoom(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: {
          room: mockRoom,
          joinToken: null
        }
      });
    });
  });

  describe('getRooms', () => {
    it('should get rooms with pagination', async () => {
      const mockRooms = [{ _id: 'room123', name: 'Test Room' }];
      RoomService.getRoomsByUserId.mockResolvedValue({
        rooms: mockRooms,
        total: 1
      });

      mockReq.query = { limit: 20, offset: 0 };

      await RoomController.getRooms(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: {
          rooms: mockRooms,
          total: 1,
          hasMore: false
        }
      });
    });
  });

  describe('getRoom', () => {
    it('should get specific room details', async () => {
      const mockRoom = { 
        _id: 'room123',
        name: 'Test Room',
        participants: ['user123']
      };

      RoomService.getRoom.mockResolvedValue(mockRoom);
      RoomService.getUnreadCount.mockResolvedValue(5);

      mockReq.params.roomId = 'room123';

      await RoomController.getRoom(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: {
          room: mockRoom,
          isParticipant: true,
          unreadCount: 5
        }
      });
    });
  });

  describe('updateRoom', () => {
    it('should update room successfully', async () => {
      const updateData = { name: 'Updated Room' };
      const mockUpdatedRoom = {
        _id: 'room123',
        ...updateData,
        participants: [{ userId: 'user123', role: 'admin' }]
      };

      mockReq.params.roomId = 'room123';
      mockReq.body = updateData;
      RoomService.updateRoom.mockResolvedValue(mockUpdatedRoom);

      await RoomController.updateRoom(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: {
          room: mockUpdatedRoom,
          message: '채팅방 정보가 업데이트되었습니다.'
        }
      });
    });

    it('should handle errors', async () => {
      RoomService.updateRoom.mockRejectedValue(new Error('Service error'));

      await RoomController.updateRoom(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Service error'
      });
    });
  });

  describe('addParticipant', () => {
    it('should add participant successfully', async () => {
      const mockUpdatedRoom = {
        _id: 'room123',
        name: 'Test Room',
        participants: [
          { userId: 'user123', role: 'admin' },
          { userId: 'newUser', role: 'member' }
        ]
      };

      mockReq.params.roomId = 'room123';
      mockReq.body = { userId: 'newUser' };
      RoomService.addParticipant.mockResolvedValue(mockUpdatedRoom);

      await RoomController.addParticipant(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: {
          room: mockUpdatedRoom,
          message: '참여자가 추가되었습니다.'
        }
      });
    });
  });

  describe('removeParticipant', () => {
    it('should remove participant successfully', async () => {
      const mockUpdatedRoom = {
        _id: 'room123',
        name: 'Test Room',
        participants: [{ userId: 'user123', role: 'admin' }]
      };

      mockReq.params.roomId = 'room123';
      mockReq.body = { userId: 'memberToRemove' };
      RoomService.removeParticipant.mockResolvedValue(mockUpdatedRoom);

      await RoomController.removeParticipant(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: {
          room: mockUpdatedRoom,
          message: '참여자가 제거되었습니다.'
        }
      });
    });
  });
}); 