const request = require('supertest');
const express = require('express');
const roomRoutes = require('../../src/routes/roomRoutes');
const RoomController = require('../../src/controllers/roomController');

// RoomController의 모든 메서드 모킹
jest.mock('../../src/controllers/roomController', () => ({
  createRoom: jest.fn(),
  getRooms: jest.fn(),
  getRoom: jest.fn(),
  updateRoom: jest.fn(),
  addParticipant: jest.fn(),
  removeParticipant: jest.fn()
}));

const app = express();
app.use(express.json());
app.use('/api/rooms', roomRoutes);

describe('Room Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/rooms', () => {
    it('should route to createRoom controller', async () => {
      const mockResponse = {
        success: true,
        data: { _id: 'room123', name: 'Test Room' }
      };

      RoomController.createRoom.mockImplementation((req, res) => {
        res.status(201).json(mockResponse);
      });

      const response = await request(app)
        .post('/api/rooms')
        .send({ name: 'Test Room' });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockResponse);
      expect(RoomController.createRoom).toHaveBeenCalled();
    });
  });

  describe('GET /api/rooms', () => {
    it('should route to getRooms controller', async () => {
      const mockResponse = {
        success: true,
        data: [{ _id: 'room123', name: 'Test Room' }]
      };

      RoomController.getRooms.mockImplementation((req, res) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .get('/api/rooms');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
      expect(RoomController.getRooms).toHaveBeenCalled();
    });
  });
}); 