const RoomController = require('../../src/controllers/roomController');
const RoomService = require('../../src/services/roomService');

jest.mock('../../src/services/roomService');

describe('RoomController', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      user: { id: 'user123' },
      body: {},
      params: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('getRoom', () => {
    it('should get a specific room successfully', async () => {
      const mockRoom = { 
        _id: 'room123', 
        name: 'Test Room',
        participants: [{ userId: 'user123', role: 'admin' }]
      };
      RoomService.getRoom.mockResolvedValue(mockRoom);

      mockReq.params.roomId = 'room123';

      await RoomController.getRoom(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockRoom
      });
    });

    it('should handle room not found error', async () => {
      RoomService.getRoom.mockRejectedValue(new Error('Room not found'));

      mockReq.params.roomId = 'nonexistent';

      await RoomController.getRoom(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Room not found'
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
        data: mockUpdatedRoom
      });
    });

    it('should handle unauthorized update', async () => {
      mockReq.params.roomId = 'room123';
      mockReq.body = { name: 'Updated Room' };
      RoomService.updateRoom.mockRejectedValue(
        new Error('Unauthorized: Only admin can update room')
      );

      await RoomController.updateRoom(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Unauthorized: Only admin can update room'
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
        data: mockUpdatedRoom
      });
    });

    it('should handle duplicate participant error', async () => {
      mockReq.params.roomId = 'room123';
      mockReq.body = { userId: 'existingUser' };
      RoomService.addParticipant.mockRejectedValue(
        new Error('User is already a participant')
      );

      await RoomController.addParticipant(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'User is already a participant'
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
        data: mockUpdatedRoom
      });
    });

    it('should handle unauthorized removal', async () => {
      mockReq.params.roomId = 'room123';
      mockReq.body = { userId: 'adminUser' };
      RoomService.removeParticipant.mockRejectedValue(
        new Error('Unauthorized: Cannot remove other participants')
      );

      await RoomController.removeParticipant(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Unauthorized: Cannot remove other participants'
      });
    });
  });
}); 