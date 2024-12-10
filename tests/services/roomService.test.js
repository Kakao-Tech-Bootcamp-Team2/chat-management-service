const RoomService = require('../../src/services/roomService');
const Room = require('../../src/models/Room');
const mongoose = require('mongoose');

// Room 모델 모킹
jest.mock('../../src/models/Room');

describe('RoomService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createRoom', () => {
    it('should create a room successfully', async () => {
      const roomData = {
        name: 'Test Room',
        description: 'Test Description',
        isPrivate: false
      };
      const creatorId = 'user123';

      const expectedRoom = {
        _id: 'mock-id',
        ...roomData,
        participants: [{
          userId: creatorId,
          role: 'admin'
        }]
      };

      Room.prototype.save = jest.fn().mockResolvedValue(expectedRoom);
      Room.mockImplementation(() => ({
        ...roomData,
        participants: [{
          userId: creatorId,
          role: 'admin'
        }],
        save: Room.prototype.save
      }));

      const result = await RoomService.createRoom(roomData, creatorId);
      expect(result).toEqual(expectedRoom);
    });

    it('should throw error when room name is missing', async () => {
      const validationError = new mongoose.Error.ValidationError();
      validationError.errors.name = new mongoose.Error.ValidatorError({
        message: 'Validation failed'
      });

      Room.prototype.save = jest.fn().mockRejectedValue(validationError);
      Room.mockImplementation(() => ({
        save: Room.prototype.save
      }));

      await expect(RoomService.createRoom({}, 'user123'))
        .rejects
        .toThrow('Failed to create room');
    });
  });

  describe('getRoom', () => {
    it('should get room by id successfully', async () => {
      const mockRoom = {
        _id: 'room123',
        name: 'Test Room'
      };

      Room.findById = jest.fn().mockResolvedValue(mockRoom);

      const result = await RoomService.getRoom('room123');
      expect(result).toEqual(mockRoom);
    });

    it('should throw error if room not found', async () => {
      Room.findById = jest.fn().mockResolvedValue(null);

      await expect(RoomService.getRoom('nonexistent'))
        .rejects
        .toThrow('Room not found');
    });
  });

  describe('getRoomsByUserId', () => {
    it('should return rooms for a user', async () => {
      const mockRooms = [
        { _id: 'room123', name: 'Test Room' }
      ];

      Room.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockRooms)
      });

      const result = await RoomService.getRoomsByUserId('user123');
      expect(result).toEqual(mockRooms);
    });
  });

  describe('updateRoom', () => {
    it('should update room successfully', async () => {
      const mockRoom = {
        _id: 'room123',
        participants: [{ userId: 'admin123', role: 'admin' }]
      };

      const updatedRoom = {
        ...mockRoom,
        name: 'Updated Room'
      };

      Room.findById = jest.fn().mockResolvedValue(mockRoom);
      Room.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedRoom);

      const result = await RoomService.updateRoom('room123', { name: 'Updated Room' }, 'admin123');
      expect(result).toEqual(updatedRoom);
    });

    it('should throw error if room not found', async () => {
      Room.findById = jest.fn().mockResolvedValue(null);

      await expect(RoomService.updateRoom('room123', {}, 'user123'))
        .rejects
        .toThrow('Room not found');
    });

    it('should throw error if user is not admin', async () => {
      Room.findById = jest.fn().mockResolvedValue({
        participants: [{ userId: 'user123', role: 'member' }]
      });

      await expect(RoomService.updateRoom('room123', {}, 'user123'))
        .rejects
        .toThrow('Unauthorized: Only admin can update room');
    });
  });

  describe('addParticipant', () => {
    it('should add participant successfully', async () => {
      const mockRoom = {
        _id: 'room123',
        participants: [],
        save: jest.fn()
      };

      mockRoom.save.mockResolvedValue({
        ...mockRoom,
        participants: [{ userId: 'newUser', role: 'member' }]
      });

      Room.findById = jest.fn().mockResolvedValue(mockRoom);

      const result = await RoomService.addParticipant('room123', 'newUser');
      expect(result.participants).toHaveLength(1);
    });

    it('should throw error if room not found', async () => {
      Room.findById = jest.fn().mockResolvedValue(null);

      await expect(RoomService.addParticipant('room123', 'user123'))
        .rejects
        .toThrow('Room not found');
    });
  });

  describe('removeParticipant', () => {
    it('should remove participant successfully', async () => {
      const mockRoom = {
        _id: 'room123',
        participants: [
          { userId: 'admin123', role: 'admin' },
          { userId: 'user123', role: 'member' }
        ],
        save: jest.fn()
      };

      mockRoom.save.mockResolvedValue({
        ...mockRoom,
        participants: [{ userId: 'admin123', role: 'admin' }]
      });

      Room.findById = jest.fn().mockResolvedValue(mockRoom);

      const result = await RoomService.removeParticipant('room123', 'user123', 'admin123');
      expect(result.participants).toHaveLength(1);
    });

    it('should throw error if room not found', async () => {
      Room.findById = jest.fn().mockResolvedValue(null);

      await expect(RoomService.removeParticipant('room123', 'user123', 'admin123'))
        .rejects
        .toThrow('Room not found');
    });
  });
}); 